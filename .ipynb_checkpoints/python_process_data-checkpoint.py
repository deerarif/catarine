#ssh -L 3306:192.168.0.13:3306 root@143.42.69.150
# -*- coding: utf-8 -*-
import pandas as pd
import sqlalchemy

data = "/home/arif/nnewIcon/MASTER WhatsappAuto Update agustus 2023.xlsx"
x = pd.read_excel(data,sheet_name="STOK",index_col=None)
x.dropna(how='all')
x.drop(x.loc[x['Input']=='SUPERSEDE'].index, inplace=True)
x.drop(x.loc[x['Input']=='DISCONTINUE'].index, inplace=True)
x.drop(x.loc[x['Input']=='SUBSTITUSI'].index, inplace=True)
x.drop(x.loc[x['Input'].isnull()].index, inplace=True)
drop_list = ["Input","Ket","OH",902,900,"HET","STD DUS","Respon"]
x = x.drop(x.columns.difference(drop_list), axis=1)
x.map(str)

database_username = 'root'
database_password = 'satuduatiga'
database_ip       = '192.168.0.13'
database_name     = 'catarine'
database_connection = sqlalchemy.create_engine('mysql+mysqlconnector://{0}:{1}@{2}/{3}'.
                                               format(database_username, database_password, 
                                                      database_ip, database_name))
x.to_sql(con=database_connection, name='Stock', if_exists='replace')
