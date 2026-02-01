import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RALColor } from './MassifCalculator';

interface RALColorData {
  code: string;
  name: string;
  hex: string;
}

const RAL_COLORS: Record<RALColor, RALColorData> = {
  '9006': { code: '9006', name: 'Aluminium blanc', hex: '#A5A5A5' },
  '9005': { code: '9005', name: 'Noir profond', hex: '#0A0A0A' },
  '7016': { code: '7016', name: 'Gris anthracite', hex: '#293133' },
  '9002': { code: '9002', name: 'Blanc gris', hex: '#E7EBDA' },
  '3009': { code: '3009', name: 'Rouge oxyde', hex: '#703731' },
  '6005': { code: '6005', name: 'Vert mousse', hex: '#2F4538' },
  '8012': { code: '8012', name: 'Rouge brun', hex: '#5C3832' },
  '1015': { code: '1015', name: 'Ivoire clair', hex: '#E6D2B5' },
};

interface RALColorSelectorProps {
  value?: RALColor;
  onChange: (color: RALColor) => void;
}

export function RALColorSelector({ value = '9006', onChange }: RALColorSelectorProps) {
  const selectedColor = RAL_COLORS[value];

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-sm mb-2 block">Couleur RAL</Label>
        <Select value={value} onValueChange={(val) => onChange(val as RALColor)}>
          <SelectTrigger className="border-2 bg-white">
            <SelectValue>
              <div className="flex items-center gap-2">
                <div 
                  className="w-5 h-5 rounded border border-slate-300 shrink-0" 
                  style={{ backgroundColor: selectedColor.hex }}
                />
                <span>RAL {selectedColor.code} - {selectedColor.name}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(RAL_COLORS).map(([key, color]) => (
              <SelectItem key={key} value={key}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-5 h-5 rounded border border-slate-300 shrink-0" 
                    style={{ backgroundColor: color.hex }}
                  />
                  <span>RAL {color.code} - {color.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tôle ondulée preview */}
      <div className="bg-white border-2 border-slate-200 rounded-lg p-4">
        <p className="text-xs text-slate-600 mb-2 font-medium">Aperçu de la tôle ondulée :</p>
        <CorrugatedSheetPreview color={selectedColor.hex} />
      </div>
    </div>
  );
}

interface CorrugatedSheetPreviewProps {
  color: string;
}

function CorrugatedSheetPreview({ color }: CorrugatedSheetPreviewProps) {
  return (
    <div className="relative w-full h-24 rounded overflow-hidden border border-slate-300">
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 400 100" 
        preserveAspectRatio="none"
        className="absolute inset-0"
      >
        <defs>
          {/* Gradient pour l'effet 3D */}
          <linearGradient id={`corrugationGradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.7" />
            <stop offset="25%" stopColor={color} stopOpacity="1" />
            <stop offset="50%" stopColor={color} stopOpacity="0.8" />
            <stop offset="75%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.7" />
          </linearGradient>
          
          {/* Pattern pour les ondulations */}
          <pattern id={`corrugation-${color}`} x="0" y="0" width="40" height="100" patternUnits="userSpaceOnUse">
            <path
              d="M 0 100 Q 5 80, 10 50 T 20 0 T 30 50 Q 35 80, 40 100 Z"
              fill={`url(#corrugationGradient-${color})`}
              stroke="rgba(0,0,0,0.1)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        
        {/* Fond avec pattern ondulé */}
        <rect width="100%" height="100%" fill={`url(#corrugation-${color})`} />
        
        {/* Lignes verticales pour accentuer les ondulations */}
        {Array.from({ length: 11 }).map((_, i) => (
          <line
            key={i}
            x1={i * 40}
            y1="0"
            x2={i * 40}
            y2="100"
            stroke="rgba(0,0,0,0.05)"
            strokeWidth="1"
          />
        ))}
        
        {/* Ombres pour effet de relief */}
        {Array.from({ length: 10 }).map((_, i) => (
          <rect
            key={`shadow-${i}`}
            x={i * 40 + 20}
            y="0"
            width="2"
            height="100"
            fill="rgba(0,0,0,0.1)"
          />
        ))}
      </svg>
      
      {/* Overlay pour effet métallique */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(90deg, transparent, transparent 38px, rgba(255,255,255,0.3) 38px, rgba(255,255,255,0.3) 40px)',
        }}
      />
    </div>
  );
}
