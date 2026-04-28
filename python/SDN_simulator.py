class SDNSwitch:
    def __init__(self):
        self.flow_table = {}

    def receive_packet(self, packet, controller):
        destination = packet["dst_ip"]

        if destination in self.flow_table:
            out_port = self.flow_table[destination]
            print(f"Switch: van szabály → továbbítás a(z) {out_port}. portra")
        else:
            print("Switch: nincs szabály → megkérdezem a kontrollert")
            out_port = controller.decide(packet)

            self.flow_table[destination] = out_port
            print(f"Switch: új szabály eltárolva: {destination} → port {out_port}")
            print(f"Switch: csomag továbbítása a(z) {out_port}. portra")


class SDNController:
    def decide(self, packet):
        destination = packet["dst_ip"]

        if destination == "10.0.0.2":
            return 2
        elif destination == "10.0.0.3":
            return 3
        else:
            return "DROP"


controller = SDNController()
switch = SDNSwitch()

packet1 = {
    "src_ip": "10.0.0.1",
    "dst_ip": "10.0.0.2"
}

packet2 = {
    "src_ip": "10.0.0.1",
    "dst_ip": "10.0.0.2"
}

print("1. csomag:")
switch.receive_packet(packet1, controller)

print("\n2. csomag:")
switch.receive_packet(packet2, controller)