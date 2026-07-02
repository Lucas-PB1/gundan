import {
  Document,
  Page,
  Text,
  View,
  pdf,
} from '@react-pdf/renderer';
import type { PilotSheet, HarmTrack } from '../../../domain/entities/PilotSheet';
import { countLoad } from '../../../domain/entities/PilotSheet';
import { LOAD_LIMITS, SCAR_CONDITIONS, type ScarCondition } from '../../../shared/data/beamSaberGearData';
import {
  getPlaybookById,
  getActionLabel,
  PILOT_ACTIONS,
  PILOT_ATTRIBUTES,
  VEHICLE_ACTIONS,
  VEHICLE_ATTRIBUTES,
} from '../../../shared/data/beamSaberPilotData';
import { attrLabel, loadLabel, loadModeLabel, scarLabel } from '../../../shared/i18n/pt';
import { getAbilityDescription, getAbilityLabel } from '../../../shared/data/beamSaberHelpData';
import { PILOT_HARM_LEVELS, VEHICLE_DAMAGE_LEVELS } from '../../../shared/data/beamSaberDamageHelp';
import { pdfStyles } from './pilotPdfStyles';

const PILOT_HARM_HINTS = PILOT_HARM_LEVELS.map((r) => ({
  level: String(r.level),
  hint: r.label.replace(/^Nível \d — /, ''),
}));

const VEHICLE_DAMAGE_HINTS = VEHICLE_DAMAGE_LEVELS.map((r) => ({
  level: String(r.level),
  hint: r.label.replace(/^Nível \d — /, ''),
}));

const CONNECTION_LABELS = { squad: 'Esquadrão', rival: 'Rival', ally: 'Aliado' } as const;

function StressTrack({ current, max }: { current: number; max: number }) {
  return (
    <View style={pdfStyles.stressRow}>
      {Array.from({ length: max + 1 }, (_, i) => (
        <View
          key={i}
          style={[pdfStyles.stressBox, i <= current ? pdfStyles.stressBoxFilled : {}]}
        />
      ))}
    </View>
  );
}

function TickTrack({ ticks, max = 4 }: { ticks: number; max?: number }) {
  return (
    <View style={pdfStyles.tickRow}>
      {Array.from({ length: max }, (_, i) => (
        <View key={i} style={[pdfStyles.tick, i < ticks ? pdfStyles.tickFilled : {}]} />
      ))}
    </View>
  );
}

function XpTrackPdf({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <View style={pdfStyles.xpTrack}>
      <View style={pdfStyles.xpHead}>
        <Text>{label}</Text>
        <Text>
          {value}/{max}
        </Text>
      </View>
      <View style={pdfStyles.xpBoxes}>
        {Array.from({ length: max }, (_, i) => (
          <View key={i} style={[pdfStyles.xpBox, i < value ? pdfStyles.xpBoxOn : {}]} />
        ))}
      </View>
    </View>
  );
}

function StatusBadge({ label, active }: { label: string; active: boolean }) {
  return (
    <Text style={[pdfStyles.badge, active ? pdfStyles.badgeWarn : pdfStyles.badgeOk]}>
      {label}: {active ? 'gasto' : 'disponível'}
    </Text>
  );
}

function TextField({
  label,
  value,
  bonusActionId,
}: {
  label: string;
  value: string;
  bonusActionId?: string;
}) {
  const bonus =
    bonusActionId && bonusActionId.trim()
      ? `+1 ${getActionLabel(bonusActionId)}`
      : null;

  return (
    <View style={pdfStyles.col}>
      <Text style={pdfStyles.fieldLabel}>{label}</Text>
      <Text style={pdfStyles.fieldValue}>{value.trim() || '—'}</Text>
      {bonus ? <Text style={pdfStyles.fieldBonus}>{bonus}</Text> : null}
    </View>
  );
}

function HarmStack({
  title,
  harm,
  level4Label,
  levelHints,
}: {
  title: string;
  harm: HarmTrack;
  level4Label: string;
  levelHints: readonly { level: string; hint: string }[];
}) {
  return (
    <View style={pdfStyles.col}>
      <Text style={pdfStyles.harmTitle}>{title}</Text>
      {levelHints.map((row) => {
        const text = harm[`level${row.level}` as 'level1' | 'level2' | 'level3'];
        return (
          <View key={row.level} style={pdfStyles.harmBox}>
            <View style={pdfStyles.harmLevel}>
              <Text>{row.level}</Text>
              <Text style={pdfStyles.harmHint}>{row.hint}</Text>
            </View>
            <Text style={pdfStyles.harmText}>{text.trim() || '—'}</Text>
          </View>
        );
      })}
      {harm.level4 ? <Text style={pdfStyles.harmFatal}>{level4Label}</Text> : null}
    </View>
  );
}

function ActionPanel({
  title,
  actions,
  ratings,
  attributes,
}: {
  title: string;
  actions: { id: string; name: string; attribute: string }[];
  ratings: Record<string, number>;
  attributes: readonly string[];
}) {
  return (
    <View style={[pdfStyles.panel, pdfStyles.col]}>
      <Text style={pdfStyles.panelTitle}>{title}</Text>
      {attributes.map((attr) => {
        const group = actions.filter((a) => a.attribute === attr);
        if (group.length === 0) return null;
        return (
          <View key={attr}>
            <Text style={pdfStyles.attrHead}>{attrLabel(attr)}</Text>
            {group.map((a) => (
              <View key={a.id} style={pdfStyles.actionRow}>
                <Text style={pdfStyles.actionName}>{a.name}</Text>
                <Text style={pdfStyles.actionRating}>{ratings[a.id] ?? 0}</Text>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
}

function PageFooter({ name }: { name: string }) {
  return (
    <View style={pdfStyles.footer} fixed>
      <Text>{name}</Text>
      <Text>Gerado em {new Date().toLocaleString('pt-BR')}</Text>
      <Text>Beam Saber playtest · Ferramenta de fãs</Text>
    </View>
  );
}

export function PilotPdfDocument({ pilot }: { pilot: PilotSheet }) {
  const playbook = getPlaybookById(pilot.playbookId);
  const equipped = pilot.loadout.filter((i) => i.equipped);
  const totalLoad = countLoad(pilot.loadout);
  const loadLimit = LOAD_LIMITS[pilot.loadMode];
  const displayName = pilot.callSign.trim() || pilot.name.trim() || 'Piloto';
  const abilityDesc = pilot.ability ? getAbilityDescription(pilot.playbookId, pilot.ability) : undefined;

  return (
    <Document title={`${displayName} — Beam Saber`} author="Beam Saber Ficha">
      <Page size="A4" style={pdfStyles.page} wrap>
        <View style={pdfStyles.heroRow}>
          <View style={pdfStyles.heroMain}>
            <Text style={pdfStyles.eyebrow}>Beam Saber RPG · Ficha de piloto</Text>
            <Text style={pdfStyles.heroName}>{displayName}</Text>
            <Text style={pdfStyles.subtitle}>
              {[playbook?.name, pilot.name && pilot.callSign ? pilot.name : ''].filter(Boolean).join(' · ') || '—'}
            </Text>
            {pilot.pronouns ? (
              <View style={pdfStyles.metaRow}>
                <Text style={pdfStyles.metaLabel}>Pronomes</Text>
                <Text style={pdfStyles.metaValue}>{pilot.pronouns}</Text>
              </View>
            ) : null}
            {pilot.look ? (
              <View style={pdfStyles.metaRow}>
                <Text style={pdfStyles.metaLabel}>Aparência</Text>
                <Text style={pdfStyles.metaValue}>{pilot.look}</Text>
              </View>
            ) : null}
          </View>
          <View style={pdfStyles.heroAside}>
            <Text style={pdfStyles.quickLabel}>Estresse</Text>
            <Text style={pdfStyles.quickValue}>
              {pilot.stress}/{pilot.stressMax}
            </Text>
            <StressTrack current={pilot.stress} max={pilot.stressMax} />
            <View style={pdfStyles.badgeRow}>
              <StatusBadge label="Armadura" active={pilot.armorUsed} />
              <StatusBadge label="Centelha" active={pilot.sparkUsed} />
            </View>
          </View>
        </View>

        {(pilot.ability || pilot.extraAbilities.length > 0) && (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Habilidades</Text>
            <View style={pdfStyles.row2}>
              {pilot.ability ? (
                <View style={[pdfStyles.abilityCard, pdfStyles.abilityPrimary]}>
                  <Text style={pdfStyles.abilityTag}>Principal</Text>
                  <Text>{getAbilityLabel(pilot.playbookId, pilot.ability)}</Text>
                  {abilityDesc ? <Text style={pdfStyles.abilityDesc}>{abilityDesc}</Text> : null}
                </View>
              ) : null}
              {pilot.extraAbilities.map((a) => {
                const desc = getAbilityDescription(pilot.playbookId, a);
                return (
                  <View key={a} style={pdfStyles.abilityCard}>
                    <Text>{getAbilityLabel(pilot.playbookId, a)}</Text>
                    {desc ? <Text style={pdfStyles.abilityDesc}>{desc}</Text> : null}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>Narrativa</Text>
          <View style={pdfStyles.row2}>
            <TextField label="História" value={pilot.history} bonusActionId={pilot.historyBonusActionId} />
            <TextField label="Tragédia" value={pilot.tragedy} />
          </View>
          <View style={[pdfStyles.row2, { marginTop: 4 }]}>
            <TextField label="Abertura" value={pilot.opening} bonusActionId={pilot.openingBonusActionId} />
            <TextField label="Impulso" value={pilot.drive} />
          </View>
          <View style={pdfStyles.driveRow}>
            <View>
              <Text style={pdfStyles.fieldLabel}>Relógio de impulso 1</Text>
              <TickTrack ticks={pilot.driveClocks[0]} />
            </View>
            <View>
              <Text style={pdfStyles.fieldLabel}>Relógio de impulso 2</Text>
              <TickTrack ticks={pilot.driveClocks[1]} />
            </View>
          </View>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>Ações</Text>
          <View style={pdfStyles.row2}>
            <ActionPanel
              title="Piloto"
              actions={PILOT_ACTIONS}
              ratings={pilot.actionRatings}
              attributes={PILOT_ATTRIBUTES}
            />
            <ActionPanel
              title="Veículo"
              actions={VEHICLE_ACTIONS}
              ratings={pilot.vehicleActionRatings}
              attributes={VEHICLE_ATTRIBUTES}
            />
          </View>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>Condição & experiência</Text>
          <View style={pdfStyles.row2}>
            <HarmStack
              title="Ferimentos do piloto"
              harm={pilot.harm}
              level4Label="Nível 4 — Morto"
              levelHints={PILOT_HARM_HINTS}
            />
            <View style={[pdfStyles.panel, pdfStyles.col]}>
              <Text style={pdfStyles.panelTitle}>Experiência</Text>
              <XpTrackPdf label="Arquétipo" value={pilot.playbookXp} max={8} />
              <XpTrackPdf label="Geral" value={pilot.generalXp} max={10} />
              <XpTrackPdf label="Perspicácia" value={pilot.attributeXp.insight} max={6} />
              <XpTrackPdf label="Destreza" value={pilot.attributeXp.prowess} max={6} />
              <XpTrackPdf label="Determinação" value={pilot.attributeXp.resolve} max={6} />
              <View style={pdfStyles.inlineStat}>
                <Text style={pdfStyles.fieldLabel}>Relógio de cura</Text>
                <TickTrack ticks={pilot.healingClockFilled} />
              </View>
            </View>
          </View>
          <View style={{ marginTop: 6 }}>
            <Text style={pdfStyles.fieldLabel}>Marcas</Text>
            <View style={pdfStyles.scarRow}>
              {SCAR_CONDITIONS.map((scar) => {
                const active = pilot.scars.includes(scar);
                return (
                  <Text key={scar} style={[pdfStyles.tag, active ? pdfStyles.tagOn : {}]}>
                    {scarLabel(scar as ScarCondition)}
                  </Text>
                );
              })}
            </View>
          </View>
        </View>

        {pilot.connections.length > 0 && (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Conexões</Text>
            <View style={pdfStyles.connGrid}>
              {pilot.connections.map((c) => (
                <View key={c.id} style={pdfStyles.connCard}>
                  <View style={pdfStyles.connHead}>
                    <Text>{c.name || '—'}</Text>
                    <Text style={pdfStyles.muted}>{CONNECTION_LABELS[c.type]}</Text>
                  </View>
                  {c.type !== 'ally' && (
                    <View style={pdfStyles.inlineStat}>
                      <Text style={pdfStyles.fieldLabel}>Relógio</Text>
                      <TickTrack ticks={c.ticks} />
                    </View>
                  )}
                  {c.beliefs.filter(Boolean).length > 0 && (
                    <Text style={{ fontSize: 8, marginTop: 3 }}>
                      <Text style={{ fontWeight: 700 }}>Crenças: </Text>
                      {c.beliefs.filter(Boolean).join(' · ')}
                    </Text>
                  )}
                  {c.description ? (
                    <Text style={[pdfStyles.muted, { marginTop: 2, fontStyle: 'normal' }]}>
                      {c.description}
                    </Text>
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>Equipamento</Text>
          <Text style={{ fontSize: 8, marginBottom: 4 }}>
            Carga {totalLoad} / {loadLimit} · {loadModeLabel(pilot.loadMode)}
          </Text>
          {equipped.length > 0 ? (
            equipped.map((i) => (
              <View key={i.gearId} style={pdfStyles.gearItem}>
                <Text>{i.name}</Text>
                <Text style={pdfStyles.muted}>{loadLabel(i.load)}</Text>
              </View>
            ))
          ) : (
            <Text style={pdfStyles.muted}>Nenhum item equipado.</Text>
          )}
          {pilot.customGear ? (
            <Text style={{ fontSize: 8, marginTop: 4 }}>
              <Text style={{ fontWeight: 700 }}>Personalizado: </Text>
              {pilot.customGear}
            </Text>
          ) : null}
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>Veículo — {pilot.vehicleName || 'Sem nome'}</Text>
          {pilot.vehicleLook ? (
            <Text style={[pdfStyles.fieldValue, { marginBottom: 6 }]}>{pilot.vehicleLook}</Text>
          ) : null}
          <View style={pdfStyles.row2}>
            <HarmStack
              title="Dano do veículo"
              harm={pilot.vehicleDamage}
              level4Label="Destruído (nível 4)"
              levelHints={VEHICLE_DAMAGE_HINTS}
            />
            <View style={[pdfStyles.panel, pdfStyles.col]}>
              <Text style={pdfStyles.panelTitle}>Progresso</Text>
              <View style={pdfStyles.inlineStat}>
                <Text style={pdfStyles.fieldLabel}>Colapso</Text>
                <TickTrack ticks={pilot.breakdownTicks} />
              </View>
              <XpTrackPdf label="Aprimoramento" value={pilot.vehicleEnhanceXp} max={4} />
              <XpTrackPdf label={attrLabel('expertise')} value={pilot.vehicleAttributeXp.expertise} max={6} />
              <XpTrackPdf label={attrLabel('acuity')} value={pilot.vehicleAttributeXp.acuity} max={6} />
            </View>
          </View>
          <Text style={pdfStyles.subheading}>Peculiaridades</Text>
          <View style={pdfStyles.quirkGrid}>
            {pilot.quirks.map((q, i) => (
              <View key={i} style={[pdfStyles.quirk, q.exhausted ? pdfStyles.quirkSpent : {}]}>
                <Text style={{ fontWeight: 700, fontSize: 8 }}>
                  {q.name || `Peculiaridade ${i + 1}`}
                  {q.exhausted ? ' (esgotada)' : ''}
                </Text>
                {q.descriptor1 ? <Text style={{ fontSize: 8 }}>+ {q.descriptor1}</Text> : null}
                {q.descriptor2 ? <Text style={{ fontSize: 8 }}>− {q.descriptor2}</Text> : null}
                {!q.descriptor1 && !q.descriptor2 && !q.name ? (
                  <Text style={pdfStyles.muted}>—</Text>
                ) : null}
              </View>
            ))}
          </View>
        </View>

        {pilot.notes ? (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Notas</Text>
            <Text style={pdfStyles.notes}>{pilot.notes}</Text>
          </View>
        ) : null}

        <PageFooter name={displayName} />
      </Page>
    </Document>
  );
}

export async function buildPilotPdfBlob(pilot: PilotSheet): Promise<Blob> {
  return pdf(<PilotPdfDocument pilot={pilot} />).toBlob();
}
