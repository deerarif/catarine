#ssh -L 3306:192.168.0.13:3306 root@143.42.69.150
# -*- coding: utf-8 -*-
import pandas as pd
import sqlalchemy

new_file_path = './DATA CATHERINE ARIF.xlsx'
gf = pd.read_excel(new_file_path,sheet_name="STOCK",index_col=None) #data untuk barang
sf = pd.read_excel(new_file_path,sheet_name="ORDERAN",index_col=None) #data untuk Dealer/Orderan
bf = pd.read_excel(new_file_path,sheet_name="STD DUS",index_col=None) #data untuk Stock_Barang dus buat cek harga dari order
af = pd.read_excel(new_file_path,sheet_name="DATA TEALER",index_col=None) #data dealer
gf = gf.drop(gf.columns.difference(['Input',"Ket1","STD DUS","HET","Respon"]), axis=1)
gf.rename(columns={'Input': 'Kode_Barang', 'Ket1': 'Nama_Barang', 'STD DUS' : 'QTY_Dus_Barang','HET': 'Harga_Barang','Respon':'Status_Barang'}, inplace=True)
sf = sf.drop(sf.columns.difference(['Order Date',"Order No","Customer","Customer Name", "Material",'Material Desc',' Net Order(exc)']), axis=1)
af = af.drop(af.columns.difference(['KODE',"NAMA","Unnamed: 8"]), axis=1)
af = af.drop(index=0)
af.rename(columns={'Unnamed: 8':'No_HP'}, inplace=True)
bf = bf.drop(bf.columns.difference(['P/N SAP','Cost Price']), axis=1)
bf.rename(columns={'P/N SAP':'Kode_Barang'}, inplace=True)

server = '192.168.0.13'
database = 'test_db'
username = 'root'
password = 'satuduatiga'
database_connection = sqlalchemy.create_engine('mysql+mysqlconnector://{0}:{1}@{2}/{3}'.
                                               format(username, password,
                                                      server, database))

gf.to_sql("Stocks", database_connection,if_exists='replace',index=False)
sf.to_sql("Orderan", database_connection,if_exists='replace',index=False)
bf.to_sql("Harga_brng", database_connection,if_exists='replace',index=False)
gf.to_sql("Data_Dealer", database_connection,if_exists='replace',index=False)