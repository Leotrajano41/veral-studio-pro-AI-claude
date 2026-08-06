import Badge from '../common/Badge';
import { VIDEO_STATUSES } from '../../lib/constants';

export default function StatusBadge({ status }) {
  const s = VIDEO_STATUSES[status] || VIDEO_STATUSES.pending;
  return <Badge text={s.label} variant={s.color} />;
}
