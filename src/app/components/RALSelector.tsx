import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export type RALColor = 
  | '1015' | '1018' | '1023' 
  | '2004' | '2008' 
  | '3000' | '3020' 
  | '5001' | '5002' | '5011' | '5012' | '5017' | '5019' 
  | '6001' | '6004' | '6005' | '6008' | '6009' | '6012' | '6018' | '6019' | '6024' 
  | '7005' | '7011' | '7040' 
  | '9002' | '9006' | '9010';

interface RALColorData {
  code: string;
  name: string;
  hex: string;
  twoFaces?: boolean;
}

const RAL_COLORS: Record<RALColor, RALColorData> = {
  '1015': { code: '1015', name: 'Ivoire clair', hex: '#E6D2B5' },
  '1018': { code: '1018', name: 'Jaune zinc', hex: '#F8F32B' },
  '1023': { code: '1023', name: 'Jaune trafic', hex: '#F7B500' },
  '2004': { code: '2004', name: 'Orange pur', hex: '#E25303' },
  '2008': { code: '2008', name: 'Orange vif', hex: '#ED6B21', twoFaces: true },
  '3000': { code: '3000', name: 'Rouge feu', hex: '#A72920' },
  '3020': { code: '3020', name: 'Rouge trafic', hex: '#C1121C' },
  '5001': { code: '5001', name: 'Bleu vert', hex: '#1F4037' },
  '5002': { code: '5002', name: 'Bleu outremer', hex: '#20214F' },
  '5011': { code: '5011', name: 'Bleu acier', hex: '#1F2A44' },
  '5012': { code: '5012', name: 'Bleu clair', hex: '#3481B8' },
  '5017': { code: '5017', name: 'Bleu trafic', hex: '#005387' },
  '5019': { code: '5019', name: 'Bleu capri', hex: '#1A5784' },
  '6001': { code: '6001', name: 'Vert émeraude', hex: '#366735' },
  '6004': { code: '6004', name: 'Vert bleuté', hex: '#1C3935' },
  '6005': { code: '6005', name: 'Vert mousse', hex: '#2F4538' },
  '6008': { code: '6008', name: 'Vert brun', hex: '#39352A' },
  '6009': { code: '6009', name: 'Vert sapin', hex: '#26392F' },
  '6012': { code: '6012', name: 'Vert noir', hex: '#343E40' },
  '6018': { code: '6018', name: 'Vert jaune', hex: '#57A639' },
  '6019': { code: '6019', name: 'Vert pastel', hex: '#BDECB6' },
  '6024': { code: '6024', name: 'Vert trafic', hex: '#308446' },
  '7005': { code: '7005', name: 'Gris souris', hex: '#6C7059', twoFaces: true },
  '7011': { code: '7011', name: 'Gris fer', hex: '#4C5754' },
  '7040': { code: '7040', name: 'Gris fenêtre', hex: '#9DA3A6' },
  '9002': { code: '9002', name: 'Blanc gris', hex: '#E7EBDA' },
  '9006': { code: '9006', name: 'Alu blanc', hex: '#A5A5A5' },
  '9010': { code: '9010', name: 'Blanc pur', hex: '#F4F4F4' }
};

interface RALSelectorProps {
  value?: RALColor;
  onChange: (color: RALColor) => void;
  className?: string;
}

export function RALSelector({ value = '9006', onChange, className = '' }: RALSelectorProps) {
  const selectedColor = RAL_COLORS[value];

  return (
    <div className={className}>
      <Label className="text-xs text-slate-600 mb-2 block">
        Couleur RAL
      </Label>
      <Select value={value} onValueChange={(val) => onChange(val as RALColor)}>
        <SelectTrigger className="w-full">
          <SelectValue>
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded border border-slate-300 shrink-0" 
                style={{ backgroundColor: selectedColor.hex }}
              />
              <span className="text-sm">
                RAL {selectedColor.code} - {selectedColor.name}
                {selectedColor.twoFaces && <span className="text-blue-600 font-medium ml-1">(2 faces)</span>}
              </span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {Object.entries(RAL_COLORS).map(([key, color]) => (
            <SelectItem key={key} value={key}>
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded border border-slate-300 shrink-0" 
                  style={{ backgroundColor: color.hex }}
                />
                <span>
                  RAL {color.code} - {color.name}
                  {color.twoFaces && <span className="text-blue-600 font-medium ml-1">(2 faces)</span>}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
