import {
	ProductCard,
	type ProductCardPresetProps,
	type ProductCardType,
} from "@/components/common/ProductCard";

export type ProductCardProduct = ProductCardType;

export interface ProductListItemProps extends ProductCardPresetProps {}

export function ProductListItem({ ...props }: ProductListItemProps) {
	return (
		<li>
			<ProductCard.Preset {...props} />
		</li>
	);
}
