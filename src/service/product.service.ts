import { User } from "src/schema/user.schema";
import { CreateProductInput, GetProductInput } from "../input/product.input";
import { Product, ProductModel } from "../schema/product.schema";

const ProductSerivce = {
  async createProduct(
    input: CreateProductInput & { user: User["_id"] },
  ): Promise<Product> {
    return ProductModel.create(input);
  },

  async findProducts(): Promise<Product[]> {
    // Pagination
    return ProductModel.find().lean();
  },

  async findSingleProduct(input: GetProductInput): Promise<Product> {
    return ProductModel.findOne({ productId: input.productId }).lean();
  },
};

export default ProductSerivce;
