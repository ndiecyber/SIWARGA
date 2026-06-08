"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, Users, Banknote, BarChart3 } from "lucide-react";

function useCountUp(target: number, duration = 1400, active = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!active) return;
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start = Math.min(start + step, target);
            setCount(Math.round(start));
            if (start >= target) clearInterval(timer);
        }, 16);
        return () => clearInterval(timer);
    }, [active, target, duration]);
    return count;
}

const stats = [
    { icon: Building2, value: 120,  suffix: "",       label: "Unit Rumah"       },
    { icon: Users,     value: 456,  suffix: "",       label: "Jiwa Terdaftar"   },
    { icon: Banknote,  value: 33,   suffix: " jt",    label: "Iuran Terkumpul", prefix: "Rp" },
    { icon: BarChart3, value: 92,   suffix: "",       label: "% Tingkat Lunas"  },
];

function StatItem({
    icon: Icon,
    value,
    suffix,
    prefix,
    label,
    active,
    last,
}: (typeof stats)[0] & { active: boolean; last: boolean }) {
    const count = useCountUp(value, 1400, active);

    return (
        <div
            className="relative px-6 py-9 text-center"
            style={
                !last
                    ? { borderRight: "1px solid rgba(255,255,255,.12)" }
                    : undefined
            }
        >
            <Icon
                className="absolute right-6 top-6 h-5 w-5"
                style={{ color: "rgba(255,255,255,.2)" }}
                strokeWidth={1.5}
            />

            <div
                className="mb-1.5 font-serif font-bold leading-none text-white"
                style={{ fontSize: "clamp(28px,4vw,42px)" }}
            >
                {prefix ?? ""}
                {active ? count : 0}
                {suffix}
            </div>

            <div className="text-[13px]" style={{ color: "rgba(255,255,255,.65)" }}>
                {label}
            </div>
        </div>
    );
}

export function StatsBar() {
    const ref = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setActive(true);
                    obs.unobserve(el);
                }
            },
            { threshold: 0.3 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div ref={ref} className="bg-primary">
            <div
                className="mx-auto max-w-[1100px] px-6"
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                }}
            >
                {stats.map((s, i) => (
                    <StatItem
                        key={s.label}
                        {...s}
                        active={active}
                        last={i === stats.length - 1}
                    />
                ))}
            </div>

            <style>{`
                @media (max-width: 640px) {
                    .stats-grid { grid-template-columns: 1fr 1fr !important; }
                }
            `}</style>
        </div>
    );
}
