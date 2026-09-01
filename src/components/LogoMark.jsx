// LogoMark.jsx
import { C } from "./theme";

export default function LogoMark({ size = 36 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="48" fill={C.purple} />
            <path d="M30 50 C30 35 42 25 55 25 C68 25 78 35 78 48 C78 58 70 65 62 65 L55 65 L55 75 L45 75 L45 55 L58 55 C63 55 66 52 66 48 C66 44 62 37 55 37 C48 37 42 43 42 50 C42 57 47 63 55 63" stroke={C.coral} strokeWidth="5" strokeLinecap="round" fill="none" />
        </svg>
    );
}