import type { PilotSheet } from '../../../domain/entities/PilotSheet';
import { CREATION_RATING_HELP } from '../../../domain/creation/beamSaberCreationProgress';
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

      <section className={`${sectionClass} creation-tab__limits`}>
        <h3 className={sectionTitleClass}>{CREATION_RATING_HELP.title}</h3>
        <p className="creation-tab__limits-summary">{CREATION_RATING_HELP.summary}</p>
        <ul className="creation-tab__limits-scale">
          {CREATION_RATING_HELP.scale.map((row) => (
            <li key={row.level}>
              <span className="creation-tab__limits-level">{row.level}</span>
              {row.label}
            </li>
          ))}
        </ul>
        <div className="creation-tab__limits-grid">
          <div>
            <p className="creation-tab__limits-subtitle">De onde vêm os pontos</p>
            <ul className="creation-tab__limits-list">
              {CREATION_RATING_HELP.sources.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <p className="creation-tab__limits-campaign">{CREATION_RATING_HELP.campaign}</p>
        </div>
      </section>

      <CreationChecklist pilot={pilot} onNavigate={onNavigate} />
    </div>
  );
}
