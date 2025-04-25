import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from '@expo/vector-icons/Entypo';
import * as Animatable from 'react-native-animatable';


// Define light and dark themes
const lightTheme = {
  background: "#d2d5d9",
  card: "#fff",
  text: "#000",
  border: "#000",
};

const darkTheme = {
  background: "#1e1e1e",
  card: "#2c2c2c",
  text: "#fff",
  border: "#fff",
};

export default function Index() {
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("LKR");
  const [exchangeRates, setExchangeRates] = useState({});
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false); // <-- New state

  const theme = darkMode ? darkTheme : lightTheme;

  const fetchExchangeRate = async () => {
    try {
      const response = await axios.get(
        "https://openexchangerates.org/api/latest.json?app_id=19480defe269414584378bc97b435d22"
      );
      setExchangeRates(response.data.rates);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
    }
  };

  useEffect(() => {
    fetchExchangeRate();
  }, []);

  useEffect(() => {
    if (exchangeRates[fromCurrency] && exchangeRates[toCurrency]) {
      const usdAmount = parseFloat(amount) / exchangeRates[fromCurrency];
      const result = usdAmount * exchangeRates[toCurrency];
      setConvertedAmount(result.toFixed(2));
    }
  }, [amount, fromCurrency, toCurrency, exchangeRates]);

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    );

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.header, { color: theme.text }]}>Currency Converter</Text>
        <TextInput
          style={[styles.textInput, { borderColor: theme.border, color: theme.text }]}
          placeholder="Enter amount"
          placeholderTextColor={theme.text}
          keyboardType="numeric"
          value={amount}
          onChangeText={(text) => setAmount(text)}
        />
        <View style={styles.pickerContainer}>
          <Text style={[styles.pickerLabel, { color: theme.text }]}>From:</Text>
          <Picker
            selectedValue={fromCurrency}
            style={[styles.picker, { color: theme.text }]}
            dropdownIconColor={theme.text}
            onValueChange={(itemValue) => setFromCurrency(itemValue)}>
            {Object.keys(exchangeRates).map((currency) => (
              <Picker.Item key={currency} label={currency} value={currency} />
            ))}
          </Picker>
          <TouchableOpacity style={styles.swapButton} onPress={() => swapCurrencies()}>
            <Fontisto name="arrow-swap" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.pickerLabel, { color: theme.text }]}>To:</Text>
          <Picker
            selectedValue={toCurrency}
            style={[styles.picker, { color: theme.text }]}
            dropdownIconColor={theme.text}
            onValueChange={(itemValue) => setToCurrency(itemValue)}>
            {Object.keys(exchangeRates).map((currency) => (
              <Picker.Item key={currency} label={currency} value={currency} />
            ))}
          </Picker>
        </View>
        <View style={styles.resultContainer}>
          
          <Text style={[styles.resultText, { color: theme.text }]}>
            Converted Amount: {convertedAmount} {toCurrency}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.darkmode, { backgroundColor: theme.text }]}
        onPress={() => setDarkMode(!darkMode)}>
          {theme === lightTheme ? (
            <MaterialIcons name="dark-mode" size={24} color={theme.card} />
          ) : (
            <Entypo name="light-up" size={24} color={theme.card} />
          )}
        
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
  },
  textInput: {
    borderWidth: 1,
    width: "70%",
    marginBottom: 50,
    borderRadius: 20,
    padding: 10,
    fontSize: 18,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 35,
    textAlign: "center",
  },
  picker: {
    height: 50,
    width: 150,
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 20,

  },
  pickerContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "center",
  },
  pickerLabel: {
    fontSize: 18,
    marginBottom: 10,
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
  },
  resultText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  swapButton: {
    marginBottom: 20,
    padding: 10,
  },
  darkmode: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
});
