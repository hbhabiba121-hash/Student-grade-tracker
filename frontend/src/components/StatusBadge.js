import React from 'react';

function StatusBadge({ status }) {
  const classMap = {
    'Excellent': 'badge badge-excellent',
    'Good': 'badge badge-good',
    'Average': 'badge badge-average',
    'Failing': 'badge badge-failing',
    'No grades': 'badge badge-nogrades',
  };
  return <span className={classMap[status] || 'badge badge-nogrades'}>{status}</span>;
}

export default StatusBadge;