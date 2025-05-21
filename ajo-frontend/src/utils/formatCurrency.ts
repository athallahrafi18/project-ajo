export const formatRupiah = (value: number): string => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })
        .format(value)
        .replace("IDR", "Rp")
        .trim();
};