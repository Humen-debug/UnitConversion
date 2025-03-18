/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {createRef, useState} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {ResetIcon, TransferIcon} from '@components/Icon';
import styles from '@styles/common';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const fullTextRegExp = /^[0-9]*. [0-9]*\.?[0-9]*$/;

  const jinInputRef = createRef<TextInput>();
  const liangInputRef = createRef<TextInput>();
  const poundInputRef = createRef<TextInput>();
  const ounceInputRef = createRef<TextInput>();

  const [ounceText, setOunceText] = useState<string | undefined>(undefined);
  const [poundText, setPoundText] = useState<string | undefined>(undefined);
  const [jinText, setJinText] = useState<string | undefined>(undefined);
  const [liangText, setLiangText] = useState<string | undefined>(undefined);

  const [usingChineseMeasurement, setUsingChineseMeasurement] =
    useState<boolean>(false);

  const [jinLiangText, setJinLiangText] = useState<string | undefined>(
    undefined,
  );
  const [poundOunceText, setPoundOunceText] = useState<string | undefined>(
    undefined,
  );
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );

  const toggleMeasurement = () => {
    if (usingChineseMeasurement) {
      if (jinInputRef.current?.isFocused()) {
        jinInputRef.current?.blur();
      }
      if (liangInputRef.current?.isFocused()) {
        liangInputRef.current?.blur();
      }
      poundInputRef.current?.focus();
    } else {
      if (poundInputRef.current?.isFocused()) {
        poundInputRef.current?.blur();
      }
      if (ounceInputRef.current?.isFocused()) {
        ounceInputRef.current?.blur();
      }
      jinInputRef.current?.focus();
    }
    setUsingChineseMeasurement(value => !value);
  };

  const poundToOunce = (pound: number) => pound * 16;
  const jinToLiang = (jin: number) => jin * 16;
  const liangToJin = (liang: number) => liang / 16;
  const kgToOunce = (kg: number) => kg * 35.273962;
  const liangToOunce = (liang: number) => kgToOunce(liangToJin(liang) * 0.6);
  const ounceToLiang = (ounce: number) =>
    jinToLiang(ounce / kgToOunce(1) / 0.6);

  // convert base string to x. xx
  const moduleUnit = ({
    base,
    carry,
    force = false,
  }: {
    base?: string | number;
    carry?: string | number;
    force?: boolean;
  }): string => {
    if (force) {
      base = 0;
    }

    if (
      base === undefined ||
      (typeof base === 'string' && isNaN(parseFloat(base))) ||
      (typeof base === 'number' && isNaN(base))
    ) {
      return '';
    }
    const num: number = typeof base === 'string' ? parseFloat(base) : base;
    var quotient =
      Math.floor(num / 16) +
      (carry ? (typeof carry === 'string' ? parseFloat(carry) : carry) : 0);
    var remainder = num % 16;

    // if quotient is not an integer, transform the digital places to base number
    if (!Number.isInteger(quotient)) {
      const decimal = quotient - Math.floor(Math.abs(quotient));
      remainder += decimal * 16;
      quotient -= decimal;
      if (remainder >= 16) {
        quotient += Math.floor(remainder / 16);
        remainder %= 16;
      }
    }
    const decimals = Math.min(
      2,
      remainder.toString().split('.')[1]?.length ?? 0,
    );
    return `${quotient}. ${Number(remainder.toFixed(decimals))}`;
  };

  const reset = () => {
    setJinText(undefined);
    setLiangText(undefined);
    setOunceText(undefined);
    setPoundText(undefined);
    setJinLiangText(undefined);
    setPoundOunceText(undefined);
    setErrorMessage(undefined);
  };

  const updatePoundOunceToJinLiang = ({
    poundText: newPoundText,
    ounceText: newOunceText,
  }: {
    poundText?: string;
    ounceText?: string;
  }) => {
    const inputPound = newPoundText ? parseFloat(newPoundText) : undefined;
    const inputOunce = newOunceText ? parseFloat(newOunceText) : undefined;

    var pound: number = inputPound ?? parseFloat(poundText || '');
    var ounce: number = inputOunce ?? parseFloat(ounceText || '');
    if (isNaN(pound) && isNaN(ounce)) {
      setPoundText(undefined);
      setOunceText(undefined);
      return;
    }
    const fullPoundOunce = moduleUnit({
      carry: newPoundText ?? poundText,
      base: newOunceText ?? ounceText,
      force: !inputOunce,
    });
    const [poundT, ounceT] = fullPoundOunce.split('. ', 2);
    setPoundText(poundT);
    setOunceText(ounceT);
    setPoundOunceText(fullPoundOunce);

    const liang = ounceToLiang(
      poundToOunce(parseFloat(poundT)) + parseFloat(ounceT),
    );
    const fullJinLiang = moduleUnit({base: liang});
    const [jinT, liangT] = fullJinLiang.split('. ', 2);
    setJinText(jinT);
    setLiangText(liangT);
    setJinLiangText(fullJinLiang);
  };

  const updateJinLiangToPoundOunce = ({
    jinText: newJinText,
    liangText: newLiangText,
  }: {
    jinText?: string;
    liangText?: string;
  }) => {
    const inputJin = newJinText ? parseFloat(newJinText) : undefined;
    const inputLiang = newLiangText ? parseFloat(newLiangText) : undefined;

    var jin: number = inputJin ?? parseFloat(jinText || '');
    var liang: number = inputLiang ?? parseFloat(liangText || '');
    if (isNaN(jin) && isNaN(liang)) {
      setJinText(undefined);
      setLiangText(undefined);
      return;
    }
    const fullJinLiang = moduleUnit({
      carry: newJinText ?? jinText,
      base: newLiangText ?? liangText,
      force: !inputLiang,
    });
    const [jinT, liangT] = fullJinLiang.split('. ', 2);
    setJinText(jinT);
    setLiangText(liangT);
    setJinLiangText(fullJinLiang);

    const ounce = liangToOunce(
      jinToLiang(parseFloat(jinT)) + parseFloat(liangT),
    );
    const fullPoundOunce = moduleUnit({base: ounce});
    const [poundT, ounceT] = fullPoundOunce.split('. ', 2);
    setPoundText(poundT);
    setOunceText(ounceT);
    setPoundOunceText(fullPoundOunce);
  };

  const UKMeasurementFields = (
    <View style={styles.row}>
      <TextInput
        value={poundText}
        ref={poundInputRef}
        onChangeText={text => {
          if (text.includes('.') && text.split('.')[1]?.length === 0) {
            setPoundText(text);
            return;
          }
          updatePoundOunceToJinLiang({poundText: text});
        }}
        onSubmitEditing={() => ounceInputRef.current?.focus()}
        keyboardType="numeric"
        style={_styles.valueInput}
        autoFocus={!usingChineseMeasurement}
        readOnly={usingChineseMeasurement}
      />
      <Text style={_styles.unitText}>磅</Text>
      <TextInput
        value={ounceText}
        ref={ounceInputRef}
        onChangeText={text => {
          if (text.includes('.') && text.split('.')[1]?.length === 0) {
            setOunceText(text);
            return;
          }
          updatePoundOunceToJinLiang({ounceText: text});
        }}
        keyboardType="numeric"
        style={_styles.valueInput}
        readOnly={usingChineseMeasurement}
      />
      <Text style={_styles.unitText}>安士</Text>
    </View>
  );

  const ChineseMeasurementFields = (
    <View style={styles.row}>
      <TextInput
        value={jinText}
        ref={jinInputRef}
        onChangeText={text => {
          if (text.includes('.') && text.split('.')[1]?.length === 0) {
            setJinText(text);
            return;
          }
          updateJinLiangToPoundOunce({jinText: text});
        }}
        onSubmitEditing={() => liangInputRef.current?.focus()}
        keyboardType="numeric"
        style={_styles.valueInput}
        autoFocus={usingChineseMeasurement}
        readOnly={!usingChineseMeasurement}
      />
      <Text style={_styles.unitText}>斤</Text>
      <TextInput
        value={liangText}
        ref={liangInputRef}
        onChangeText={text => {
          if (text.includes('.') && text.split('.')[1]?.length === 0) {
            setLiangText(text);
            return;
          }
          updateJinLiangToPoundOunce({liangText: text});
        }}
        keyboardType="numeric"
        style={_styles.valueInput}
        readOnly={!usingChineseMeasurement}
      />
      <Text style={_styles.unitText}>兩</Text>
    </View>
  );

  const FullChineseMeasurementField = (
    <View style={styles.row}>
      <TextInput
        style={_styles.fullValueInput}
        value={jinLiangText}
        onChangeText={setJinLiangText}
        onSubmitEditing={e => {
          // validate input with xx. xx format
          const regex = new RegExp(fullTextRegExp);
          const text = e.nativeEvent.text;
          if (!regex.test(text)) {
            setErrorMessage('請按照 (斤). (兩) 的格式輸入有效數字');
            return;
          }
          setErrorMessage('');
          try {
            const [jinInput, liangInput] = text.split('. ', 2);
            // To compute carrying if user inputs liang larger than 16
            const fullJinLiang = moduleUnit({
              carry: jinInput,
              base: liangInput,
            });
            const [jinT, liangT] = fullJinLiang.split('. ');
            setJinText(jinT);
            setLiangText(liangT);
            setJinLiangText(fullJinLiang);

            const ounce = liangToOunce(
              jinToLiang(parseFloat(jinT)) + parseFloat(liangT),
            );
            const fullPoundOunce = moduleUnit({base: ounce});
            const [poundT, ounceT] = fullPoundOunce.split('. ', 2);
            setPoundText(poundT);
            setOunceText(ounceT);
            setPoundOunceText(fullPoundOunce);
          } catch (error) {
            setErrorMessage('請按照 (斤). (兩) 的格式輸入有效數字');
          }
        }}
      />
      <Text style={_styles.unitText}>斤. 兩</Text>
    </View>
  );

  const FullUKMeasurementField = (
    <View style={styles.row}>
      <TextInput
        style={_styles.fullValueInput}
        value={poundOunceText}
        onChangeText={setPoundOunceText}
        onSubmitEditing={e => {
          // validate input with xx. xx format
          const regex = new RegExp(fullTextRegExp);
          const text = e.nativeEvent.text;
          if (!regex.test(text)) {
            setErrorMessage('請按照 (磅). (安士) 的格式輸入有效數字');
            return;
          }
          setErrorMessage('');
          try {
            const [poundInput, ounceInput] = text.split('. ', 2);
            const fullPoundOunce = moduleUnit({
              carry: poundInput,
              base: ounceInput,
            });
            const [poundT, ounceT] = fullPoundOunce.split('. ', 2);
            setPoundText(poundT);
            setOunceText(ounceT);
            setPoundOunceText(fullPoundOunce);

            const liang = ounceToLiang(
              poundToOunce(parseFloat(poundT)) + parseFloat(ounceT),
            );

            const fullJinLiang = moduleUnit({base: liang});
            const [jinT, liangT] = fullJinLiang.split('. ', 2);
            setJinText(jinT);
            setLiangText(liangT);
            setJinLiangText(fullJinLiang);
          } catch (error) {
            setErrorMessage('請按照 (磅). (安士) 的格式輸入有效數字');
          }
        }}
      />
      <Text style={_styles.unitText}>磅. 安士</Text>
    </View>
  );

  const Header = (
    <View style={_styles.header}>
      <TouchableOpacity onPress={reset}>
        <View style={_styles.resetBtn}>
          <ResetIcon width={24} height={24} marginTop={4} marginRight={8} />
          <Text style={{fontSize: 24}}>重設</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const safePadding = '5%';

  return (
    <View>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {Header}
      <ScrollView>
        <View
          style={{
            paddingHorizontal: safePadding,
            paddingVertical: safePadding,
            ...styles.column,
          }}>
          <View style={_styles.grid}>
            {usingChineseMeasurement
              ? ChineseMeasurementFields
              : UKMeasurementFields}
            <TouchableOpacity
              onPress={toggleMeasurement}
              style={_styles.convertBtn}>
              <TransferIcon height={40} width={40} />
            </TouchableOpacity>
            {usingChineseMeasurement
              ? UKMeasurementFields
              : ChineseMeasurementFields}
          </View>
          <View style={_styles.divider} />
          <View style={{..._styles.grid, gap: 20}}>
            {usingChineseMeasurement
              ? FullChineseMeasurementField
              : FullUKMeasurementField}
            {!usingChineseMeasurement
              ? FullChineseMeasurementField
              : FullUKMeasurementField}
            <Text style={_styles.errorMessage}>{errorMessage}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const _styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  resetBtn: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 32,
    justifyContent: 'center',
    alignContent: 'center',
  },
  grid: {
    flex: 4,
    justifyContent: 'center',
    alignContent: 'center',
  },
  unitText: {
    fontSize: 32,
    flex: 1,
    minWidth: 60,
    alignSelf: 'center',
  },
  unitsText: {
    fontSize: 40,
    flex: 1,
  },
  valueInput: {
    fontSize: 32,
    paddingHorizontal: 8,
    paddingVertical: 8,
    flex: 1,
    minWidth: 88,
    height: 88,
    textAlign: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    borderWidth: 2,
    borderRadius: 4,
    marginHorizontal: 12,
  },
  fullValueInput: {
    fontSize: 32,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 2,
    flex: 3,
    textAlign: 'right',
    marginRight: 24,
    minHeight: 72,
  },
  convertBtn: {
    marginHorizontal: 'auto',
    minWidth: 40,
    minHeight: 40,
    padding: 20,
    margin: 12,
  },
  divider: {
    backgroundColor: '#000',
    width: '100%',
    height: 2,
    flex: 1,
    marginVertical: 40,
  },
  errorMessage: {
    color: 'red',
    fontSize: 16,
  },
});

export default App;
