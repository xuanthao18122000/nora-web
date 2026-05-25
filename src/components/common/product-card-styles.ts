/**
 * Shared card sizing — single source of truth for product card dimensions.
 * Use CARD_FIXED_WIDTH in carousel/flex layouts (flash sale, homepage sections).
 */

/** Fixed width for carousel cards (FlashSaleCard, homepage product sections) */
export const CARD_FIXED_WIDTH =
	"w-[180px] md:w-[224px] shrink-0 h-full" as const;
