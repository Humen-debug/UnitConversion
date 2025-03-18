import {SvgProps} from 'react-native-svg';
import { ViewProps } from 'react-native';

export {default as EqualIcon} from "@assets/icons/equal.svg";
export {default as ResetIcon} from "@assets/icons/reset.svg";
export {default as TransferIcon} from '@assets/icons/transfer.svg';

type IIConProps = Omit<ViewProps, 'hitSlop'> & SvgProps;

export interface IconProps extends IIConProps {
  fill?: string;
  size?: number;
}
