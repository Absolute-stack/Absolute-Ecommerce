import { Product } from "../models/productModel.js";
import { deleteCloudinaryImages } from "../middleware/multer.js";

// admin functions
export async function createProduct(req, res) {
  try {
    const { name, description, category, price, sizes, stock } = req.body;
    let images;
    if (req.files?.length > 0) {
      images =
        req.files
          ?.map((file) => file.secure_url || file.path)
          .filter(Boolean) || [];
    }

    const parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;

    const product = await Product.create({
      name,
      description,
      category,
      price: Number(price),
      images,
      sizes: parsedSizes,
      stock: Number(stock),
    });

    return res.status(201).json({
      success: true,
      message: `${product.name} created successfully`,
    });
  } catch (error) {
    if (req.files?.length > 0) {
      await deleteCloudinaryImages(
        req.files.map((file) => file.secure_url || file.path),
      );
    }
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function updateProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    const { name, description, category, price, sizes, stock, imagesToDelete } =
      req.body;
    let currentImages = [...product.images];
    if (imagesToDelete) {
      const toDelete =
        typeof imagesToDelete === "string"
          ? JSON.parse(imagesToDelete)
          : imagesToDelete;

      currentImages = currentImages.filter((img) => !toDelete.includes(img));
      await deleteCloudinaryImages(toDelete);
    }
    const newImages = req.files?.map((f) => f.secure_url || f.path);
    const updatedImages = [...currentImages, ...newImages];
    const updates = {};
    if (name) updates.name = name;
    if (description) updates.description = description;
    if (category) updates.category = category;
    if (price) updates.price = Number(price);
    if (sizes)
      updates.sizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
    if (stock) updates.stock = stock;
    if (Number(stock) <= 0) {
      updates.isActive = false;
    }
    if (Number(stock) > 0 && !product.isActive) {
      updates.isActive = true;
    }
    updates.images = updatedImages;
    await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      validateBeforeSave: false,
    });
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    if (req.files?.length > 0) {
      await deleteCloudinaryImages(
        req.files?.map((f) => f.secure_url || f.path),
      );
    }
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function deleteProduct(req, res) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function getAllAdminProducts(req, res) {
  try {
    const { limit = 20, cursor, isActive } = req.query;
    const limitNum = Math.min(Number(limit), 50);
    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === "true";

    if (cursor) filter._id = { $lt: cursor };

    const products = await Product.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limitNum + 1)
      .lean();

    const hasNextPage = products.length > limitNum;
    if (hasNextPage) products.pop();
    const nextCursor = hasNextPage ? products[products.length - 1]._id : null;
    return res.status(200).json({
      products,
      nextCursor,
      hasNextPage,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

// user functions
export async function getProducts(req, res) {
  try {
    const {
      limit = 20,
      cursor,
      search,
      category,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;
    const limitNum = Math.min(Number(limit), 50);
    const sortOrder = order === "desc" ? -1 : 1;

    const filter = { isActive: true };
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) filter.name = { $regex: search, $options: "i" };
    function castCursor(cursor) {
      if (sortBy === "price" || sortBy === "stock") return Number(cursor);
      if (sortBy === "createdAt" || sortBy === "updatedAt")
        return new Date(cursor);
      return cursor;
    }
    if (cursor)
      filter[sortBy] = {
        [order === "desc" ? "$lt" : "$gt"]: castCursor(cursor),
      };

    const products = await Product.find(filter)
      .sort({
        [sortBy]: sortOrder,
        _id: sortOrder,
      })
      .limit(limitNum + 1)
      .lean();

    const hasNextPage = products.length > limitNum;
    if (hasNextPage) products.pop();

    const lastItem = products[products.length - 1];
    const nextCursor = hasNextPage
      ? sortBy === "createdAt" || sortBy === "updatedAt"
        ? lastItem[sortBy].toISOString()
        : String(lastItem[sortBy])
      : null;

    return res.status(200).json({
      products,
      nextCursor,
      hasNextPage,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function getProductFilters(req, res) {
  try {
    const [categories, priceRange] = await Promise.all([
      Product.distinct("category", { isActive: true }),
      Product.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" },
          },
        },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      categories,
      minPrice: priceRange[0]?.minPrice ?? 0,
      maxPrice: priceRange[0]?.maxPrice ?? 0,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    return res.status(200).json({
      product,
      success: true,
      message: "Fetched product successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function checkAndDeactivate(productId) {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  if (product && product.stock <= 0) {
    await Product.findByIdAndUpdate(
      productId,
      { isActive: false },
      { new: true },
    );
  }
}
