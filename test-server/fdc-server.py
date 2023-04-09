import socket
import sys
import random

SEVER_IP = "localhost"
SERVER_PORT = 8000


def genValues(dict_data: dict, min, max):
    for dict_key in dict_data.keys():
        dict_data[dict_key] = random.randint(min, max)


sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_address = (SEVER_IP, SERVER_PORT)
print(f"starting up on %s port {server_address}")
sock.bind(server_address)

sock.listen(1)

actq_data = {"R1": 0, "R2": 0, "T": 0, "Z1": 0, "Z2": 0}
aptq_data = {"R1": 0, "R2": 0, "T": 0, "Z1": 0, "Z2": 0}
actm_data = {"R1": 0, "R2": 0, "T": 0, "Z1": 0, "Z2": 0}
apos_data = {"R1": 0, "R2": 0, "T": 0, "Z1": 0, "Z2": 0}

while True:
    # Wait for a connection
    print("waiting for a connection")
    connection, client_address = sock.accept()

    try:
        print(f"connection from {client_address}")

        # Receive the data in small chunks and retransmit it
        while True:
            data = connection.recv(16)
            print(f"received data: {data}")
            if data:
                dataStr = data.decode("utf-8")
                if dataStr.find("GETACTQ\n") >= 0:
                    genValues(actq_data, -400, 400)
                    respDataStr = f"ACTQR1{actq_data.get('R1'):+06d}R2{actq_data.get('R2'):+06d}T{actq_data.get('T'):+06d}Z1{actq_data.get('Z1'):+06d}Z2{actq_data.get('Z2'):+06d}\n"
                    respData = bytes(respDataStr, "utf-8")
                    print("respData: ", respData)
                    connection.sendall(respData)

                elif dataStr.find("GETAPTQ\n") >= 0:
                    genValues(aptq_data, -400, 400)
                    respDataStr = f"APTQR1{aptq_data.get('R1'):+06d}R2{aptq_data.get('R2'):+06d}T{aptq_data.get('T'):+06d}Z1{aptq_data.get('Z1'):+06d}Z2{aptq_data.get('Z2'):+06d}\n"
                    respData = bytes(respDataStr, "utf-8")
                    print("respData: ", respData)
                    connection.sendall(respData)

                elif dataStr.find("GETACTM\n") >= 0:
                    genValues(actm_data, -40, 40)
                    respDataStr = f"ACTMR1{actm_data.get('R1'):+05d}R2{actm_data.get('R2'):+05d}T{actm_data.get('T'):+05d}Z1{actm_data.get('Z1'):+05d}Z2{actm_data.get('Z2'):+05d}\n"
                    respData = bytes(respDataStr, "utf-8")
                    print("respData: ", respData)
                    connection.sendall(respData)

                elif dataStr.find("GETAPOS\n") >= 0:
                    genValues(apos_data, -4000, 4000)
                    respDataStr = f"APOSR1{apos_data.get('R1'):+08d}R2{apos_data.get('R2'):+08d}T{apos_data.get('T'):+07d}Z1{apos_data.get('Z1'):+08d}Z2{apos_data.get('Z2'):+08d}\n"
                    respData = bytes(respDataStr, "utf-8")
                    print("respData: ", respData)
                    connection.sendall(respData)
                else:
                    print(f"invalid packet data: {data}")

            else:
                print(f"no more data from {client_address}")
                break
    except Exception as ex:
        print("Exception: ", ex)

    finally:
        connection.close()
