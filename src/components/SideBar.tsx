import { Tooltip } from '@reach/tooltip';
import cx from 'clsx';
import * as React from 'react';
import { Info } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { MdAreaChart, MdFilterAlt, MdLanguage, MdLink, MdList, MdSettings } from 'react-icons/md';
import { useQuery } from 'react-query';
import { Link, useLocation } from 'react-router-dom';

import { fetchVersion } from '~/api/version';
import { ThemeSwitcher } from '~/components/shared/ThemeSwitcher';
import { connect } from '~/components/StateProvider';
import { getClashAPIConfig } from '~/store/app';
import { ClashAPIConfig } from '~/types';

import s0 from './APIConfig.module.scss';
import s from './SideBar.module.scss';
import SvgYacd from './SvgYacd';

type Props = { apiConfig: ClashAPIConfig };

const icons = {
  activity: MdAreaChart,
  globe: MdLanguage,
  command: MdFilterAlt,
  file: MdList,
  settings: MdSettings,
  link: MdLink,
};

const SideBarRow = React.memo(function SideBarRow({
  isActive,
  to,
  iconId,
  labelText,
}: SideBarRowProps) {
  const Comp = icons[iconId];
  const className = cx(s.row, isActive ? s.rowActive : null);
  return (
    <Link to={to} className={className}>
      <Comp />
      <div className={s.label}>{labelText}</div>
    </Link>
  );
});

interface SideBarRowProps {
  isActive: boolean;
  to: string;
  iconId?: string;
  labelText?: string;
}

const pages = [
  {
    to: '/',
    iconId: 'activity',
    labelText: 'Overview',
  },
  {
    to: '/proxies',
    iconId: 'globe',
    labelText: 'Proxies',
  },
  {
    to: '/rules',
    iconId: 'command',
    labelText: 'Rules',
  },
  {
    to: '/connections',
    iconId: 'link',
    labelText: 'Conns',
  },
  {
    to: '/configs',
    iconId: 'settings',
    labelText: 'Config',
  },
  {
    to: '/logs',
    iconId: 'file',
    labelText: 'Logs',
  },
];

const mapState = (s) => ({
  apiConfig: getClashAPIConfig(s),
});

export default connect(mapState)(SideBar);

function SideBar(props: Props) {
  const { t } = useTranslation();
  const location = useLocation();

  const { data: version } = useQuery(['/version', props.apiConfig], () =>
    fetchVersion('/version', props.apiConfig)
  );
  return (
    <div className={s.root}>
      <div className={s.logoPlaceholder}>
        <div className={s0.header}>
          <div className={s0.icon}>
            <SvgYacd width={90} height={90} stroke="var(--stroke)" />
          </div>
        </div>
      </div>
      <div className={s.rows}>
        {pages.map(({ to, iconId, labelText }) => (
          <SideBarRow
            key={to}
            to={to}
            isActive={location.pathname === to}
            iconId={iconId}
            labelText={t(labelText)}
          />
        ))}
      </div>
      <div className={s.footer}>
        <ThemeSwitcher />
        <Tooltip label={t('about')}>
          <Link to="/about" className={s.iconWrapper}>
            <Info size={20} />
          </Link>
        </Tooltip>
      </div>
    </div>
  );
}
