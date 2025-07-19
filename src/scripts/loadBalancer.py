import requests
import time

LOAD_BALANCER_URL = "http://localhost:8080/call-backend-manual-lb"
NUM_REQUESTS = 10

def test_load_balancer():
    print(f"--- Slanje {NUM_REQUESTS} zahteva ka Load Balanceru ({LOAD_BALANCER_URL}) ---")
    print("-" * 60)

    for i in range(1, NUM_REQUESTS + 1):
        try:
            print(f"Zahtev {i}/{NUM_REQUESTS}: Slanje...")
            response = requests.get(LOAD_BALANCER_URL)
            response.raise_for_status() 
            print(f"Zahtev {i}/{NUM_REQUESTS}: Odgovor: {response.text}")
        except requests.exceptions.ConnectionError as e:
            print(f"Zahtev {i}/{NUM_REQUESTS}: GRESKA - Nije moguce povezati se na Load Balancer: {e}")
        except requests.exceptions.RequestException as e:
            print(f"Zahtev {i}/{NUM_REQUESTS}: GRESKA - Doslo je do greske prilikom zahteva: {e}")
        finally:
            print("-" * 60)
            time.sleep(0.5) 

    print("\n--- Testiranje završeno ---")

if __name__ == "__main__":
    test_load_balancer()
    