"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Plus, Pencil, Trash2, Save, X, ChevronDown, ChevronUp,
  Cloud, Server, ToggleLeft, ToggleRight,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────

interface PricingProduct {
  id: number;
  key: string;
  icon: string;
  iconDark: string | null;
  descriptionId: string;
  descriptionEn: string;
  sortOrder: number;
  isActive: boolean;
}

interface PricingFeature {
  id: number;
  tierId: number;
  labelId: string;
  labelEn: string;
  included: boolean;
  sortOrder: number;
}

interface PricingTier {
  id: number;
  productId: number;
  deployment: string;
  name: string;
  price: number;
  period: string;
  highlighted: boolean;
  badge: string | null;
  sortOrder: number;
  isActive: boolean;
  features: PricingFeature[];
}

interface BundleFeature {
  id: number;
  productId: number;
  deployment: string;
  tierName: string;
  labelId: string;
  labelEn: string;
  sortOrder: number;
}

interface Discount {
  id: number;
  minApps: number;
  discountPercent: number;
  sortOrder: number;
}

interface Comparison {
  id: number;
  labelId: string;
  labelEn: string;
  showStandard: boolean;
  showProfessional: boolean;
  showPremium: boolean;
  sortOrder: number;
}

type Tab = "pricing" | "bundle" | "discount" | "comparison";

// ─── Component ──────────────────────────────────────────────

export default function CmsPricingPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("pricing");
  const [deployment, setDeployment] = useState<"saas" | "onpremise">("saas");

  // Data
  const [products, setProducts] = useState<PricingProduct[]>([]);
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [bundleFeatures, setBundleFeatures] = useState<BundleFeature[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [comparison, setComparison] = useState<Comparison[]>([]);

  // UI state
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);
  const [expandedTier, setExpandedTier] = useState<number | null>(null);
  const [expandedBundle, setExpandedBundle] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Modal states
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState<PricingFeature | null>(null);
  const [featureForm, setFeatureForm] = useState({ labelId: "", labelEn: "", included: true });
  const [featureTargetTierId, setFeatureTargetTierId] = useState<number>(0);

  const [showBundleModal, setShowBundleModal] = useState(false);
  const [editingBundleFeature, setEditingBundleFeature] = useState<BundleFeature | null>(null);
  const [bundleForm, setBundleForm] = useState({ labelId: "", labelEn: "" });
  const [bundleTarget, setBundleTarget] = useState<{
    productId: number;
    tierName: string;
  } | null>(null);

  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [editingComparison, setEditingComparison] = useState<Comparison | null>(null);
  const [comparisonForm, setComparisonForm] = useState({
    labelId: "",
    labelEn: "",
    showStandard: true,
    showProfessional: false,
    showPremium: false,
  });

  const [showProductModal, setShowProductModal] = useState(false);
  const [productForm, setProductForm] = useState({
    key: "",
    icon: "",
    iconDark: "",
    descriptionId: "",
    descriptionEn: "",
  });

  // ─── Fetch Data ─────────────────────────────────────────

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/pricing/admin");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProducts(data.products || []);
      setTiers(data.tiers || []);
      setBundleFeatures(data.bundleFeatures || []);
      setDiscounts(data.discounts || []);
      setComparison(data.comparison || []);
    } catch (err) {
      console.error(err);
      showNotification("error", "Gagal memuat data pricing");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // ─── Product CRUD ───────────────────────────────────────

  const openCreateProduct = () => {
    setProductForm({ key: "", icon: "", iconDark: "", descriptionId: "", descriptionEn: "" });
    setShowProductModal(true);
  };

  const saveProduct = async () => {
    if (!productForm.key || !productForm.icon || !productForm.descriptionId || !productForm.descriptionEn) {
      showNotification("error", "Semua field wajib diisi");
      return;
    }
    try {
      const res = await fetch("/api/pricing/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productForm),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed");
      }
      const { product } = await res.json();
      setProducts((prev) => [...prev, product]);
      setShowProductModal(false);
      showNotification("success", "Produk ditambahkan");
    } catch (e) {
      showNotification("error", e instanceof Error ? e.message : "Gagal menambahkan produk");
    }
  };

  const deleteProduct = async (productId: number, key: string) => {
    if (!window.confirm(`Hapus produk "${key}" beserta semua tier dan fiturnya?`)) return;
    try {
      const res = await fetch(`/api/pricing/product/${productId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setTiers((prev) => prev.filter((t) => t.productId !== productId));
      setBundleFeatures((prev) => prev.filter((bf) => bf.productId !== productId));
      showNotification("success", "Produk dihapus");
    } catch {
      showNotification("error", "Gagal menghapus produk");
    }
  };

  // ─── Tier Updates ───────────────────────────────────────

  const updateTier = async (tierId: number, data: Partial<PricingTier>) => {
    try {
      const res = await fetch(`/api/pricing/tier/${tierId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setTiers((prev) =>
        prev.map((t) => (t.id === tierId ? { ...t, ...data } : t))
      );
      showNotification("success", "Tier diperbarui");
    } catch {
      showNotification("error", "Gagal memperbarui tier");
    }
  };

  // ─── Feature CRUD ───────────────────────────────────────

  const openCreateFeature = (tierId: number) => {
    setEditingFeature(null);
    setFeatureForm({ labelId: "", labelEn: "", included: true });
    setFeatureTargetTierId(tierId);
    setShowFeatureModal(true);
  };

  const openEditFeature = (feature: PricingFeature) => {
    setEditingFeature(feature);
    setFeatureForm({
      labelId: feature.labelId,
      labelEn: feature.labelEn,
      included: feature.included,
    });
    setFeatureTargetTierId(feature.tierId);
    setShowFeatureModal(true);
  };

  const saveFeature = async () => {
    try {
      if (editingFeature) {
        const res = await fetch(`/api/pricing/feature/${editingFeature.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(featureForm),
        });
        if (!res.ok) throw new Error("Failed");
        setTiers((prev) =>
          prev.map((t) =>
            t.id === featureTargetTierId
              ? {
                  ...t,
                  features: t.features.map((f) =>
                    f.id === editingFeature.id ? { ...f, ...featureForm } : f
                  ),
                }
              : t
          )
        );
        showNotification("success", "Fitur diperbarui");
      } else {
        const res = await fetch("/api/pricing/feature", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tierId: featureTargetTierId,
            ...featureForm,
            sortOrder: tiers.find((t) => t.id === featureTargetTierId)?.features.length ?? 0,
          }),
        });
        if (!res.ok) throw new Error("Failed");
        const { feature } = await res.json();
        setTiers((prev) =>
          prev.map((t) =>
            t.id === featureTargetTierId
              ? { ...t, features: [...t.features, feature] }
              : t
          )
        );
        showNotification("success", "Fitur ditambahkan");
      }
      setShowFeatureModal(false);
    } catch {
      showNotification("error", "Gagal menyimpan fitur");
    }
  };

  const deleteFeature = async (featureId: number, tierId: number) => {
    if (!window.confirm("Hapus fitur ini?")) return;
    try {
      const res = await fetch(`/api/pricing/feature/${featureId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      setTiers((prev) =>
        prev.map((t) =>
          t.id === tierId
            ? { ...t, features: t.features.filter((f) => f.id !== featureId) }
            : t
        )
      );
      showNotification("success", "Fitur dihapus");
    } catch {
      showNotification("error", "Gagal menghapus fitur");
    }
  };

  // ─── Bundle Feature CRUD ────────────────────────────────

  const openCreateBundle = (productId: number, tierName: string) => {
    setEditingBundleFeature(null);
    setBundleForm({ labelId: "", labelEn: "" });
    setBundleTarget({ productId, tierName });
    setShowBundleModal(true);
  };

  const openEditBundle = (bf: BundleFeature) => {
    setEditingBundleFeature(bf);
    setBundleForm({ labelId: bf.labelId, labelEn: bf.labelEn });
    setBundleTarget({ productId: bf.productId, tierName: bf.tierName });
    setShowBundleModal(true);
  };

  const saveBundleFeature = async () => {
    if (!bundleTarget) return;
    try {
      if (editingBundleFeature) {
        const res = await fetch(
          `/api/pricing/bundle-feature/${editingBundleFeature.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bundleForm),
          }
        );
        if (!res.ok) throw new Error("Failed");
        setBundleFeatures((prev) =>
          prev.map((bf) =>
            bf.id === editingBundleFeature.id ? { ...bf, ...bundleForm } : bf
          )
        );
        showNotification("success", "Bundle fitur diperbarui");
      } else {
        const res = await fetch("/api/pricing/bundle-feature", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...bundleTarget,
            deployment,
            ...bundleForm,
            sortOrder: bundleFeatures.filter(
              (bf) =>
                bf.productId === bundleTarget.productId &&
                bf.deployment === deployment &&
                bf.tierName === bundleTarget.tierName
            ).length,
          }),
        });
        if (!res.ok) throw new Error("Failed");
        const { bundleFeature } = await res.json();
        setBundleFeatures((prev) => [...prev, bundleFeature]);
        showNotification("success", "Bundle fitur ditambahkan");
      }
      setShowBundleModal(false);
    } catch {
      showNotification("error", "Gagal menyimpan bundle fitur");
    }
  };

  const deleteBundleFeature = async (id: number) => {
    if (!window.confirm("Hapus bundle fitur ini?")) return;
    try {
      const res = await fetch(`/api/pricing/bundle-feature/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      setBundleFeatures((prev) => prev.filter((bf) => bf.id !== id));
      showNotification("success", "Bundle fitur dihapus");
    } catch {
      showNotification("error", "Gagal menghapus bundle fitur");
    }
  };

  // ─── Discount Update ────────────────────────────────────

  const updateDiscount = async (id: number, discountPercent: number) => {
    try {
      const res = await fetch(`/api/pricing/discount/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discountPercent }),
      });
      if (!res.ok) throw new Error("Failed");
      setDiscounts((prev) =>
        prev.map((d) =>
          d.id === id ? { ...d, discountPercent } : d
        )
      );
      showNotification("success", "Diskon diperbarui");
    } catch {
      showNotification("error", "Gagal memperbarui diskon");
    }
  };

  // ─── Comparison CRUD ────────────────────────────────────

  const openCreateComparison = () => {
    setEditingComparison(null);
    setComparisonForm({
      labelId: "",
      labelEn: "",
      showStandard: true,
      showProfessional: false,
      showPremium: false,
    });
    setShowComparisonModal(true);
  };

  const openEditComparison = (c: Comparison) => {
    setEditingComparison(c);
    setComparisonForm({
      labelId: c.labelId,
      labelEn: c.labelEn,
      showStandard: c.showStandard,
      showProfessional: c.showProfessional,
      showPremium: c.showPremium,
    });
    setShowComparisonModal(true);
  };

  const saveComparison = async () => {
    try {
      if (editingComparison) {
        const res = await fetch(`/api/pricing/comparison/${editingComparison.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(comparisonForm),
        });
        if (!res.ok) throw new Error("Failed");
        setComparison((prev) =>
          prev.map((c) =>
            c.id === editingComparison.id ? { ...c, ...comparisonForm } : c
          )
        );
        showNotification("success", "Baris perbandingan diperbarui");
      } else {
        const res = await fetch("/api/pricing/comparison", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...comparisonForm,
            sortOrder: comparison.length,
          }),
        });
        if (!res.ok) throw new Error("Failed");
        const { comparison: newComp } = await res.json();
        setComparison((prev) => [...prev, newComp]);
        showNotification("success", "Baris perbandingan ditambahkan");
      }
      setShowComparisonModal(false);
    } catch {
      showNotification("error", "Gagal menyimpan perbandingan");
    }
  };

  const deleteComparison = async (id: number) => {
    if (!window.confirm("Hapus baris perbandingan ini?")) return;
    try {
      const res = await fetch(`/api/pricing/comparison/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      setComparison((prev) => prev.filter((c) => c.id !== id));
      showNotification("success", "Baris perbandingan dihapus");
    } catch {
      showNotification("error", "Gagal menghapus perbandingan");
    }
  };

  const updateComparisonInline = async (id: number, data: Partial<Comparison>) => {
    try {
      const res = await fetch(`/api/pricing/comparison/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setComparison((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...data } : c))
      );
    } catch {
      showNotification("error", "Gagal memperbarui perbandingan");
    }
  };

  // ─── Helpers ────────────────────────────────────────────

  const formatPrice = (price: number) =>
    `Rp ${price.toLocaleString("id-ID")}`;

  const getProductTiers = (productId: number) =>
    tiers
      .filter((t) => t.productId === productId && t.deployment === deployment)
      .sort((a, b) => a.sortOrder - b.sortOrder);

  const getBundleKey = (productId: number, tierName: string) =>
    `${productId}-${deployment}-${tierName}`;

  const getBundleFeatures = (productId: number, tierName: string) =>
    bundleFeatures
      .filter(
        (bf) =>
          bf.productId === productId &&
          bf.deployment === deployment &&
          bf.tierName === tierName
      )
      .sort((a, b) => a.sortOrder - b.sortOrder);

  // ─── Render ─────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "pricing", label: "Harga per Produk" },
    { id: "bundle", label: "Bundle Features" },
    { id: "discount", label: "Diskon" },
    { id: "comparison", label: "Tabel Perbandingan" },
  ];

  return (
    <div>
      {/* Notification */}
      {notification && (
        <div
          className={`mb-4 rounded-lg px-4 py-3 text-sm ${
            notification.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {notification.message}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6">Pricing Management</h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Deployment Toggle (for pricing & bundle tabs) */}
      {(activeTab === "pricing" || activeTab === "bundle") && (
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit mb-6">
          <button
            onClick={() => setDeployment("saas")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              deployment === "saas"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Cloud className="h-4 w-4" />
            SaaS (Cloud)
          </button>
          <button
            onClick={() => setDeployment("onpremise")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              deployment === "onpremise"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Server className="h-4 w-4" />
            On-Premise
          </button>
        </div>
      )}

      {/* ── Tab: Pricing ── */}
      {activeTab === "pricing" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={openCreateProduct}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Tambah Produk
            </button>
          </div>
          {products.map((product) => {
            const isExpanded = expandedProduct === product.id;
            const productTiers = getProductTiers(product.id);
            return (
              <div
                key={product.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    setExpandedProduct(isExpanded ? null : product.id)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setExpandedProduct(isExpanded ? null : product.id);
                    }
                  }}
                  className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.icon}
                      alt={product.key}
                      className="h-8 w-8 object-contain"
                    />
                    <div>
                      <span className="font-semibold capitalize">
                        {product.key}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        {productTiers.length} tier
                      </span>
                    </div>
                    {!product.isActive && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded">
                        Inactive
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProduct(product.id, product.key);
                      }}
                      className="text-gray-400 hover:text-red-600"
                      title="Hapus produk"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {productTiers.map((tier) => {
                      const isTierExpanded = expandedTier === tier.id;
                      return (
                        <div
                          key={tier.id}
                          className={`border rounded-lg overflow-hidden ${
                            tier.highlighted
                              ? "border-blue-300 bg-blue-50/30"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="px-3 py-2 bg-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">
                                {tier.name}
                              </span>
                              {tier.badge && (
                                <span className="px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-700 rounded">
                                  {tier.badge}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() =>
                                setExpandedTier(
                                  isTierExpanded ? null : tier.id
                                )
                              }
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {isTierExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </button>
                          </div>

                          {/* Price display / edit inline */}
                          <div className="px-3 py-2 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold">
                                {formatPrice(tier.price)}
                              </span>
                              <button
                                onClick={() =>
                                  updateTier(tier.id, {
                                    isActive: !tier.isActive,
                                  })
                                }
                                className="text-gray-400 hover:text-gray-600"
                                title={
                                  tier.isActive
                                    ? "Nonaktifkan"
                                    : "Aktifkan"
                                }
                              >
                                {tier.isActive ? (
                                  <ToggleRight className="h-5 w-5 text-green-500" />
                                ) : (
                                  <ToggleLeft className="h-5 w-5 text-gray-300" />
                                )}
                              </button>
                            </div>
                            <div className="text-xs text-gray-500">
                              {tier.period}
                            </div>

                            {/* Quick price edit */}
                            <div className="flex gap-1">
                              <input
                                type="number"
                                defaultValue={tier.price}
                                className="flex-1 px-2 py-1 text-xs border rounded"
                                onBlur={(e) => {
                                  const val = Number(e.target.value);
                                  if (val !== tier.price) {
                                    updateTier(tier.id, { price: val });
                                  }
                                }}
                              />
                              <input
                                type="text"
                                defaultValue={tier.period}
                                className="flex-1 px-2 py-1 text-xs border rounded"
                                onBlur={(e) => {
                                  if (e.target.value !== tier.period) {
                                    updateTier(tier.id, {
                                      period: e.target.value,
                                    });
                                  }
                                }}
                              />
                            </div>

                            <div className="flex gap-2">
                              <label className="flex items-center gap-1 text-xs">
                                <input
                                  type="checkbox"
                                  checked={tier.highlighted}
                                  onChange={(e) =>
                                    updateTier(tier.id, {
                                      highlighted: e.target.checked,
                                    })
                                  }
                                  className="rounded"
                                />
                                Highlight
                              </label>
                              <input
                                type="text"
                                defaultValue={tier.badge ?? ""}
                                placeholder="Badge"
                                className="flex-1 px-2 py-1 text-xs border rounded"
                                onBlur={(e) =>
                                  updateTier(tier.id, {
                                    badge: e.target.value || null,
                                  })
                                }
                              />
                            </div>
                          </div>

                          {/* Features */}
                          {isTierExpanded && (
                            <div className="px-3 py-2 border-t border-gray-100">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-gray-500 uppercase">
                                  Fitur ({tier.features.length})
                                </span>
                                <button
                                  onClick={() =>
                                    openCreateFeature(tier.id)
                                  }
                                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                  <Plus className="h-3 w-3" />
                                  Tambah
                                </button>
                              </div>
                              <div className="space-y-1">
                                {tier.features.map((f) => (
                                  <div
                                    key={f.id}
                                    className="flex items-center justify-between text-xs py-1 px-2 bg-white rounded border border-gray-100"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={
                                          f.included
                                            ? "text-green-600"
                                            : "text-gray-400"
                                        }
                                      >
                                        {f.included ? "✓" : "✗"}
                                      </span>
                                      <span className="truncate max-w-[120px]">
                                        {f.labelId}
                                      </span>
                                    </div>
                                    <div className="flex gap-1">
                                      <button
                                        onClick={() => openEditFeature(f)}
                                        className="text-gray-400 hover:text-blue-600"
                                      >
                                        <Pencil className="h-3 w-3" />
                                      </button>
                                      <button
                                        onClick={() =>
                                          deleteFeature(f.id, tier.id)
                                        }
                                        className="text-gray-400 hover:text-red-600"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Tab: Bundle ── */}
      {activeTab === "bundle" && (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="px-4 py-3 bg-gray-50 flex items-center gap-3">
                <img
                  src={product.icon}
                  alt={product.key}
                  className="h-6 w-6 object-contain"
                />
                <span className="font-semibold capitalize">{product.key}</span>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {(["Standard", "Professional", "Premium"] as const).map(
                  (tierName) => {
                    const bundleKey = getBundleKey(product.id, tierName);
                    const isBundleExpanded = expandedBundle === bundleKey;
                    const features = getBundleFeatures(product.id, tierName);
                    return (
                      <div
                        key={tierName}
                        className="border border-gray-200 rounded-lg"
                      >
                        <button
                          onClick={() =>
                            setExpandedBundle(
                              isBundleExpanded ? null : bundleKey
                            )
                          }
                          className="flex items-center justify-between w-full px-3 py-2 bg-gray-50 hover:bg-gray-100 text-left"
                        >
                          <span className="text-sm font-medium">
                            {tierName}
                            <span className="ml-1 text-gray-400 text-xs">
                              ({features.length})
                            </span>
                          </span>
                          {isBundleExpanded ? (
                            <ChevronUp className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                        {isBundleExpanded && (
                          <div className="p-3">
                            <div className="flex justify-end mb-2">
                              <button
                                onClick={() =>
                                  openCreateBundle(product.id, tierName)
                                }
                                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                <Plus className="h-3 w-3" />
                                Tambah
                              </button>
                            </div>
                            <div className="space-y-1">
                              {features.map((bf) => (
                                <div
                                  key={bf.id}
                                  className="flex items-center justify-between text-xs py-1 px-2 bg-white rounded border border-gray-100"
                                >
                                  <span className="truncate">
                                    {bf.labelId}
                                  </span>
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => openEditBundle(bf)}
                                      className="text-gray-400 hover:text-blue-600"
                                    >
                                      <Pencil className="h-3 w-3" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        deleteBundleFeature(bf.id)
                                      }
                                      className="text-gray-400 hover:text-red-600"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                              {features.length === 0 && (
                                <p className="text-xs text-gray-400 text-center py-2">
                                  Belum ada fitur
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Tab: Discount ── */}
      {activeTab === "discount" && (
        <div className="max-w-xl">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left font-medium text-gray-600">
                    Minimal Aplikasi
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">
                    Diskon (%)
                  </th>
                </tr>
              </thead>
              <tbody>
                {discounts.map((d) => (
                  <tr key={d.id} className="border-t border-gray-100">
                    <td className="px-4 py-2">{d.minApps} aplikasi</td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        defaultValue={d.discountPercent}
                        className="w-20 px-2 py-1 border rounded text-sm"
                        onBlur={(e) => {
                          const val = Number(e.target.value);
                          if (val !== d.discountPercent) {
                            updateDiscount(d.id, val);
                          }
                        }}
                      />
                      <span className="ml-1 text-gray-500">%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tab: Comparison ── */}
      {activeTab === "comparison" && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={openCreateComparison}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Tambah Baris
            </button>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left font-medium text-gray-600">
                    Label (ID)
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">
                    Label (EN)
                  </th>
                  <th className="px-4 py-2 text-center font-medium text-gray-600">
                    Standard
                  </th>
                  <th className="px-4 py-2 text-center font-medium text-gray-600">
                    Professional
                  </th>
                  <th className="px-4 py-2 text-center font-medium text-gray-600">
                    Premium
                  </th>
                  <th className="px-4 py-2 text-right font-medium text-gray-600">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((c) => (
                  <tr key={c.id} className="border-t border-gray-100">
                    <td className="px-4 py-2">{c.labelId}</td>
                    <td className="px-4 py-2 text-gray-500">{c.labelEn}</td>
                    <td className="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={c.showStandard}
                        onChange={(e) =>
                          updateComparisonInline(c.id, {
                            showStandard: e.target.checked,
                          })
                        }
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={c.showProfessional}
                        onChange={(e) =>
                          updateComparisonInline(c.id, {
                            showProfessional: e.target.checked,
                          })
                        }
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={c.showPremium}
                        onChange={(e) =>
                          updateComparisonInline(c.id, {
                            showPremium: e.target.checked,
                          })
                        }
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={() => openEditComparison(c)}
                        className="text-gray-400 hover:text-blue-600 mr-2"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteComparison(c.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Feature Modal ── */}
      {showFeatureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingFeature ? "Edit Fitur" : "Tambah Fitur"}
              </h3>
              <button
                onClick={() => setShowFeatureModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label (Indonesia)
                </label>
                <input
                  type="text"
                  value={featureForm.labelId}
                  onChange={(e) =>
                    setFeatureForm((p) => ({ ...p, labelId: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label (English)
                </label>
                <input
                  type="text"
                  value={featureForm.labelEn}
                  onChange={(e) =>
                    setFeatureForm((p) => ({ ...p, labelEn: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={featureForm.included}
                  onChange={(e) =>
                    setFeatureForm((p) => ({
                      ...p,
                      included: e.target.checked,
                    }))
                  }
                  className="rounded"
                />
                Included (✓)
              </label>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowFeatureModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Batal
              </button>
              <button
                onClick={saveFeature}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bundle Feature Modal ── */}
      {showBundleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingBundleFeature
                  ? "Edit Bundle Fitur"
                  : "Tambah Bundle Fitur"}
              </h3>
              <button
                onClick={() => setShowBundleModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label (Indonesia)
                </label>
                <input
                  type="text"
                  value={bundleForm.labelId}
                  onChange={(e) =>
                    setBundleForm((p) => ({ ...p, labelId: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label (English)
                </label>
                <input
                  type="text"
                  value={bundleForm.labelEn}
                  onChange={(e) =>
                    setBundleForm((p) => ({ ...p, labelEn: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowBundleModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Batal
              </button>
              <button
                onClick={saveBundleFeature}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Comparison Modal ── */}
      {showComparisonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingComparison
                  ? "Edit Perbandingan"
                  : "Tambah Perbandingan"}
              </h3>
              <button
                onClick={() => setShowComparisonModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label (Indonesia)
                </label>
                <input
                  type="text"
                  value={comparisonForm.labelId}
                  onChange={(e) =>
                    setComparisonForm((p) => ({
                      ...p,
                      labelId: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label (English)
                </label>
                <input
                  type="text"
                  value={comparisonForm.labelEn}
                  onChange={(e) =>
                    setComparisonForm((p) => ({
                      ...p,
                      labelEn: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={comparisonForm.showStandard}
                    onChange={(e) =>
                      setComparisonForm((p) => ({
                        ...p,
                        showStandard: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  Standard
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={comparisonForm.showProfessional}
                    onChange={(e) =>
                      setComparisonForm((p) => ({
                        ...p,
                        showProfessional: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  Professional
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={comparisonForm.showPremium}
                    onChange={(e) =>
                      setComparisonForm((p) => ({
                        ...p,
                        showPremium: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  Premium
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowComparisonModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Batal
              </button>
              <button
                onClick={saveComparison}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Product Modal ── */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Tambah Produk</h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key (unik, lowercase)
                </label>
                <input
                  type="text"
                  placeholder="contoh: prochain"
                  value={productForm.key}
                  onChange={(e) =>
                    setProductForm((p) => ({ ...p, key: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") }))
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon URL
                </label>
                <input
                  type="text"
                  placeholder="/img/products/nama-logo-no-text.png"
                  value={productForm.icon}
                  onChange={(e) =>
                    setProductForm((p) => ({ ...p, icon: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon Dark URL (opsional)
                </label>
                <input
                  type="text"
                  placeholder="/img/products/nama-logo-dark.png"
                  value={productForm.iconDark}
                  onChange={(e) =>
                    setProductForm((p) => ({ ...p, iconDark: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi (Indonesia)
                </label>
                <input
                  type="text"
                  value={productForm.descriptionId}
                  onChange={(e) =>
                    setProductForm((p) => ({ ...p, descriptionId: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi (English)
                </label>
                <input
                  type="text"
                  value={productForm.descriptionEn}
                  onChange={(e) =>
                    setProductForm((p) => ({ ...p, descriptionEn: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowProductModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Batal
              </button>
              <button
                onClick={saveProduct}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


