import sqlite3

def check_db():
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    print("\n=== Table Structure ===")
    cursor.execute('PRAGMA table_info(animals)')
    columns = cursor.fetchall()
    for col in columns:
        print(f"Column {col[0]}: {col[1]} ({col[2]}) {col[3]} {col[4]} {col[5]}")
    
    print("\n=== Table Contents ===")
    cursor.execute('SELECT * FROM animals')
    rows = cursor.fetchall()
    for row in rows:
        print(row)
    
    conn.close()

if __name__ == "__main__":
    check_db()