import { Text, View, StyleSheet, FlatList, RefreshControl } from "react-native";
import React, { useEffect, useState } from 'react';
import { ColorProperties } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

type CurrencyData = {
  code: string;
  codein: string;
  name: string;
  high: string;
  low: string;
  varBid: string;
  pctChange: string;
  bid: string;
  ask: string;
  timestamp: string;
  create_date: string;
};

const App = () => {
  const [currencyData, setCurrencyData] = useState<Record<string, CurrencyData> | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCurrencyData();
  }, []);

  const fetchCurrencyData = async () => {
    try {
      const response = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BTC-BRL,GBP-BRL,JPY-BRL,AUD-BRL,CAD-BRL,CHF-BRL,CNY-BRL,INR-BRL,NZD-BRL,SEK-BRL,SGD-BRL');
      const data = await response.json();
      setCurrencyData(data);
      setRefreshing(false);
    } catch (error) {
      console.error('Erro ao buscar os dados da API:', error);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCurrencyData();
  };

  const formatCurrency = (value: string) => {
    return parseFloat(value).toFixed(2).replace('.', ',');
  };

  const renderCurrencyItem = ({ item }: { item: CurrencyData }) => {
    item.name = item.name.replace("/Real Brasileiro", "");

    return (
      <View style={styles.item}>
        <Text style={styles.name}>{item.name} R${formatCurrency(item.bid)}</Text>
        <Text>Alta: <Text style={styles.alta}>R${formatCurrency(item.high)}</Text></Text>
        <Text>Baixa: <Text style={styles.baixa}>R${formatCurrency(item.low)}</Text></Text>
        <Text>Compra: <Text style={styles.price}>R${formatCurrency(item.bid)}</Text></Text>
        <Text>Venda: <Text style={styles.price}>R${formatCurrency(item.ask)}</Text></Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {currencyData ? (
        <FlatList style={{ width: '90%' }}
          ListHeaderComponent={<Text style={styles.title}>Cotação BRL</Text>}
          showsVerticalScrollIndicator={false}
          data={Object.values(currencyData)}
          renderItem={renderCurrencyItem}
          keyExtractor={(item) => item.code}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="black"
            />
          }
        />
      ) : (
        <Text>Carregando...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    width: '100%',
    height: '100%',
    margin: 0,
  },

  title: {
    fontSize: 28,
    marginTop: 40,
    marginBottom: 20,
    margin: "auto",
    fontWeight: 'bold',
  },

  item: {
    padding: 20,
    backgroundColor: '#DDDEE1',
    borderRadius: 15,
    marginBottom: 15,
  },

  name: {
    color: "#000000",
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  alta: {
    color: "#FF4B4A",
    fontSize: 16,
    fontWeight: 'bold',
  },

  baixa: {
    color: "#41D4A8",
    fontSize: 16,
    fontWeight: 'bold',
  },

  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },

});

export default App;