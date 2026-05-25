import ProductBuyBox from "./components/product-buy-box.client";
import ProductGallery from "./components/product-gallery.client";
import ShareButton from "./components/share-button.client";
import { RecordRecentlyViewed } from "./utils/record-recently-viewed.client";
import ProductDetail from "./views/product-detail.client";
import ProductPageWrapper from "./views/product-page-wrapper";

export const Product = {
	PageWrapper: ProductPageWrapper,
	Detail: ProductDetail,
	Gallery: ProductGallery,
	BuyBox: ProductBuyBox,
	ShareButton,
	RecordRecentlyViewed,
};

// Named exports
export { default as ProductBuyBox } from "./components/product-buy-box.client";
export { default as ProductGallery } from "./components/product-gallery.client";
export { default as ShareButton } from "./components/share-button.client";
export { RecordRecentlyViewed } from "./utils/record-recently-viewed.client";
export { default as ProductDetail } from "./views/product-detail.client";
export { default as ProductPageWrapper } from "./views/product-page-wrapper";
