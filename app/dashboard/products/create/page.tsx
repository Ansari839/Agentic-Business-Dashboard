import { ProductForm } from "@/components/products/product-form";

export default function CreateProductPage() {
    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Create Product</h2>
            <ProductForm />
        </div>
    );
}
