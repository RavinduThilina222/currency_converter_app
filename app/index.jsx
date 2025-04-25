import axios from "axios";
import React,{useState,useEffect} from "react";
import { ActivityIndicator, StyleSheet, Text, View,TextInput, TouchableOpacity } from "react-native";
import { Picker } from '@react-native-picker/picker';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Index() {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('LKR');
  const [exchangeRates, setExchangeRates] = useState({});
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  


  const fetchExchangeRate = async () => {
    try {
      const response = await axios.get('https://openexchangerates.org/api/latest.json?app_id=19480defe269414584378bc97b435d22');
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

  if (loading) return <ActivityIndicator size="large" 
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}/>;

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  }

  


  return (
    <View style={{flex:1,backgroundColor:'#d2d5d9'}}>
    <View style={styles.container}>
      <Text style={styles.header}>Currency Converter</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={(text) => setAmount(text)}
      />
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>From:</Text>
        <Picker
          selectedValue={fromCurrency}
          style={styles.picker}
          onValueChange={(itemValue) => setFromCurrency(itemValue)}>
          {Object.keys(exchangeRates).map((currency) => (
            <Picker.Item key={currency} label={currency} value={currency} />
          ))}
        </Picker>
        <TouchableOpacity style={styles.swapButton} onPress={()=> swapCurrencies()}>
          <Fontisto name="arrow-swap" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.pickerLabel}>To:</Text>
        <Picker
          selectedValue={toCurrency}
          style={styles.picker}
          onValueChange={(itemValue) => setToCurrency(itemValue)}>
          {Object.keys(exchangeRates).map((currency) => (
            <Picker.Item key={currency} label={currency} value={currency} />
          ))}
        </Picker>

        
        
        
      </View>
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>Converted Amount: {convertedAmount} {toCurrency}</Text>
        <Text style={styles.resultText}></Text>
        
      </View>
    </View>
    <TouchableOpacity style={styles.darkmode} onPress={()=>console.log('dark mode')}>
      <MaterialIcons name="dark-mode" size={24} color="black" />
    </TouchableOpacity>
  </View>
  );
}

const styles = StyleSheet.create({
  container:{
    padding:10,
    margin:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#fff',
    borderRadius:20,
    borderWidth:1,
    borderColor:'black',
  },
  textInput:{
    borderWidth:1,
    width:'70%',
    borderColor:'black',
    marginBottom:50,
    borderRadius:20,
    padding:10,
    fontSize:18,
  },
  header:{
    fontSize:32,
    fontWeight:'bold',
    marginBottom:35,
    textAlign:'center',
  },
  picker:{
    height:50,
    width:150,
    marginBottom:20,
    borderWidth:1,
    borderColor:'black',
    borderRadius:20,
    padding:10,
    fontSize:15,
  },
  
  pickerContainer:{
    flexDirection:'column',
    justifyContent:'space-between',
    marginBottom:20,
    alignItems:'center',
  },
  pickerLabel:{
    fontSize:18,
    marginBottom:10,
  },
  resultContainer:{
    marginTop:20,
    padding:10,
  },
  resultText:{
    fontSize:16,
    fontWeight:'bold',
  },
  swapButton:{
    marginBottom:20,
    padding:10,
  },
  darkmode:{
    position:'absolute',
    bottom:20,
    right:20,
    backgroundColor:'#fff',
    borderRadius:50,
    padding:10,
    elevation:5,
  },
})

