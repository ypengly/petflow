import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Pets from "./pages/Pets";
import Playground from "./pages/Playground";
import DesktopPage from "./pages/DesktopPage";
import Support from "./pages/Support";
import SettingsPage from "./pages/Settings";
import { useEffect } from "react";
import { invoke, isTauri } from "./shared/native";
import { getSettings, useSettings } from "./shared/store";

export default function App() {
  const s = useSettings();
  useEffect(() => { document.documentElement.dataset.reduced = String(s.reducedMotion); }, [s.reducedMotion]);
  useEffect(() => { const g = getSettings(); if (isTauri() && g.restore && g.overlayOn && g.active) void invoke("start_overlay", { x: g.pos?.x, y: g.pos?.y, alwaysOnTop: g.alwaysOnTop, clickThrough: g.clickThrough }); }, []);
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pets" element={<Pets />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/desktop" element={<DesktopPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/support" element={<Support />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  );
}
