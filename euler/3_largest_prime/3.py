# The prime factors of 13195 are 5, 7, 13 and 29.
# What is the largest prime factor of the number 600851475143?

def primefactorizor(n: int) -> list[int]:
    
    primes: list[int] = []
    sqroot: float = n**0.5
    i: int = 2
    while i < sqroot:
        if n % i == 0:
            primes.append(i)
            n = n // i
        i += 1
    return primes

print(primefactorizor(600851475143))