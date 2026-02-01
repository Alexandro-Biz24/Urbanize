import { Card, CardContent } from './ui/card';
import { Signpost, HardHat, Box, Wind, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProjectTypeSelectorProps {
  onSelect: (type: 'totem' | 'palissade' | 'massif' | 'bet') => void;
}

export function ProjectTypeSelector({ onSelect }: ProjectTypeSelectorProps) {
  const projects = [
    {
      id: 'totem',
      title: 'Totem',
      description: 'Signalétique verticale pour expositions',
      icon: Signpost,
      bgColor: 'from-slate-500 to-slate-600',
      borderColor: 'border-slate-300',
      hoverBorder: 'hover:border-slate-500'
    },
    {
      id: 'palissade',
      title: 'Palissade',
      description: 'Habillage et sécurisation de chantier',
      icon: HardHat,
      bgColor: 'from-slate-600 to-slate-700',
      borderColor: 'border-slate-300',
      hoverBorder: 'hover:border-slate-600'
    },
    {
      id: 'massif',
      title: 'Massif béton',
      description: 'Lestage et stabilisation',
      icon: Box,
      bgColor: 'from-slate-500 to-slate-600',
      borderColor: 'border-slate-300',
      hoverBorder: 'hover:border-slate-500'
    },
    {
      id: 'bet',
      title: 'Étude BET',
      description: 'Résistance au vent de vos installations',
      icon: Wind,
      bgColor: 'from-slate-600 to-slate-700',
      borderColor: 'border-slate-300',
      hoverBorder: 'hover:border-slate-600'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto -mt-12">
      <div className="text-center mb-12">
        
        <p className="text-slate-600 font-medium">Sélectionnez le type de solution souhaitée</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {projects.map(project => (
          <Card 
            key={project.id}
            onClick={() => onSelect(project.id as 'totem' | 'palissade' | 'massif' | 'bet')}
            className={`border-3 ${project.borderColor} ${project.hoverBorder} cursor-pointer transition-all hover:shadow-2xl group bg-white overflow-hidden`}
          >
            <CardContent className="p-6 text-center">
              <div className={`w-16 h-16 bg-gradient-to-br ${project.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg border-2 border-slate-400 group-hover:scale-110 transition-transform`}>
                <project.icon className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h4 className="text-xl font-bold mb-2 text-slate-900">{project.title}</h4>
              <p className="text-slate-600 text-sm mb-4 font-medium">
                {project.description}
              </p>
              <div className="relative h-40 overflow-hidden rounded-lg border-2 border-slate-200">
                <ImageWithFallback
                  src={
                    project.id === 'bet' 
                      ? "https://images.unsplash.com/photo-1570719990499-454ca3d2184d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdpbmVlcmluZyUyMGJsdWVwcmludHMlMjB3aW5kfGVufDF8fHx8MTc2Nzg5NDEzN3ww&ixlib=rb-4.1.0&q=80&w=1080"
                      : project.id === 'totem' 
                      ? "/assets/massif_img.png"
                      : project.id === 'palissade' 
                      ? "/assets/bois.png"
                      : "/assets/massif_img.png"
                  }
                  alt={`${project.title} publicitaire`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 text-slate-700 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Pour en savoir plus</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}