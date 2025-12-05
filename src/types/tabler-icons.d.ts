declare module '@tabler/icons-react' {
  import { FC, SVGProps } from 'react';
  
  export interface TablerIconProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    stroke?: number | string;
    color?: string;
  }
  
  export type TablerIcon = FC<TablerIconProps>;
  
  // Icons used in CompensationSection.tsx
  export const IconTrendingUp: TablerIcon;
  export const IconSearch: TablerIcon;
  export const IconFilter: TablerIcon;
  export const IconBuilding: TablerIcon;
  export const IconCoin: TablerIcon;
  
  // Icons used in InterviewPreparation.tsx and InterviewPrepSection.tsx
  export const IconBrain: TablerIcon;
  export const IconCode: TablerIcon;
  export const IconDatabase: TablerIcon;
  export const IconDeviceDesktop: TablerIcon;
  export const IconRocket: TablerIcon;
  export const IconTarget: TablerIcon;
  
  // Icons used in page.tsx (commented out but declaring for safety)
  export const IconMessage: TablerIcon;
  export const IconUser: TablerIcon;
  export const IconCoffee: TablerIcon;
  
  // Common icons
  export const IconStar: TablerIcon;
  export const IconHeart: TablerIcon;
  export const IconCheck: TablerIcon;
  export const IconX: TablerIcon;
  export const IconArrowRight: TablerIcon;
  export const IconArrowLeft: TablerIcon;
  export const IconMenu: TablerIcon;
  export const IconHome: TablerIcon;
  export const IconSettings: TablerIcon;
  export const IconLogout: TablerIcon;
  export const IconLogin: TablerIcon;
  export const IconBrandGoogle: TablerIcon;
  export const IconBrandGithub: TablerIcon;
  export const IconBrandLinkedin: TablerIcon;
  export const IconMail: TablerIcon;
  export const IconLock: TablerIcon;
  export const IconEye: TablerIcon;
  export const IconEyeOff: TablerIcon;
  export const IconPlus: TablerIcon;
  export const IconMinus: TablerIcon;
  export const IconEdit: TablerIcon;
  export const IconTrash: TablerIcon;
  export const IconDownload: TablerIcon;
  export const IconUpload: TablerIcon;
  export const IconRefresh: TablerIcon;
  export const IconLoader: TablerIcon;
  export const IconAlertCircle: TablerIcon;
  export const IconInfoCircle: TablerIcon;
  export const IconCheckCircle: TablerIcon;
  export const IconXCircle: TablerIcon;
  
  // Catch-all for any other icons
  const icons: { [key: string]: TablerIcon };
  export default icons;
}
