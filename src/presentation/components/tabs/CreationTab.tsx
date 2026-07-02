import type { PilotSheet } from '../../../domain/entities/PilotSheet';
import type { PilotEditorNavigate } from '../../../shared/constants/pilotEditorTabs';
import { CREATION_STEPS } from '../../../shared/data/beamSaberPilotData';
import { sectionClass, sectionTitleClass } from '../ui/Field';
import { CreationChecklist } from '../ui/CreationChecklist';

export function CreationTab({
  pilot,
  onNavigate,
}: {
  pilot: PilotSheet;
  onNavigate: PilotEditorNavigate;
}) {
  return (
    <div className="flex flex-col gap-4">
      <section className={sectionClass}>
        <h3 className={sectionTitleClass}>Passos do livro</h3>
        <ol className="creation-tab__steps">
          {CREATION_STEPS.map((step, i) => (
            <li key={step}>
              <span className="creation-tab__step-num">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
        <p className="creation-tab__hint">
          Identidade e narrativa na aba <strong>Identidade</strong> · pontos de ação na aba{' '}
          <strong>Ações</strong> · robô na aba <strong>Veículo</strong>.
        </p>
      </section>

      <CreationChecklist pilot={pilot} onNavigate={onNavigate} />
    </div>
  );
}
