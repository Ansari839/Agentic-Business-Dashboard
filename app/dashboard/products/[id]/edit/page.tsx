import { ProductForm } from "@/components/products/product-form";
import { getProductById } from "@/services/product.service";
import { notFound } from "next/navigation";

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const product = await getProductById(params.id);

    if (!product) {
        notFound();
    }

    // Transform complex objects to simple JSON if needed, relying on form handling
    // Prisma returns objects/JsonValue, Form expects strict JSON objects for the form logic (which I handled in form)
    // We pass the product object directly, Form will handle it.

    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
            <ProductForm initialData={product} />
        </div>
    );
}
