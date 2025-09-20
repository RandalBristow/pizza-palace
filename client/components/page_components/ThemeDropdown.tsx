import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useTheme } from "../../contexts/ThemeContext";
import { Theme } from "node_modules/@emotion/react/dist/declarations/src/theming";

interface ThemeDropdownProps {
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
}

const themes = [
  { name: 'Light', value: 'default' as const }, // Changed from 'light' to 'default'
  { name: 'Dark', value: 'dark' as const },
  { name: 'Ocean', value: 'theme-ocean' as const },
  { name: 'Sunset', value: 'theme-sunset' as const },
  { name: 'Forest', value: 'theme-forest' as const },
];

export function ThemeDropdown({ currentTheme, onThemeChange }: ThemeDropdownProps) {
  const { theme, setTheme } = useTheme();
  
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as any);
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  };

  return (
    <Select
      value={currentTheme || theme}
      onValueChange={handleThemeChange}
    >
      <SelectTrigger
        style={{
          backgroundColor: 'var(--input)',
          borderColor: 'var(--border)',
          border: '1px solid var(--border)',
          color: 'var(--foreground)',
          outline: 'none'
        }}
        onFocus={(e) => {
          const target = e.target as HTMLElement;
          target.style.boxShadow = `0 0 0 2px var(--ring)`;
        }}
        onBlur={(e) => {
          const target = e.target as HTMLElement;
          target.style.boxShadow = 'none';
        }}
      >
        <SelectValue placeholder="Select theme" />
      </SelectTrigger>
      <SelectContent style={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)' }}>
        {themes.map((t) => (
          <SelectItem key={t.value} value={t.value} style={{ color: 'var(--popover-foreground)' }}>
            {t.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}