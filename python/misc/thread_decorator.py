from typing import Callable, TypeVar, ParamSpec, Awaitable
import functools
import asyncio
import concurrent.futures

P = ParamSpec("P")
R = TypeVar("R")

_executor: concurrent.futures.ThreadPoolExecutor = concurrent.futures.ThreadPoolExecutor()

def run_in_thread_executor(fn: Callable[P, R]) -> Callable[P, concurrent.futures.Future[R]]:
    """Sync-friendly: always returns concurrent.futures.Future[R]."""
    @functools.wraps(fn)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> concurrent.futures.Future[R]:
        return _executor.submit(fn, *args, **kwargs)
    return wrapper

def run_in_thread_awaitable(fn: Callable[P, R]) -> Callable[P, Awaitable[R]]:
    """Async-friendly: always returns an awaitable (so you can `await` it)."""
    @functools.wraps(fn)
    async def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
        loop = asyncio.get_running_loop()
        # run in the same executor so threads are reused
        return await loop.run_in_executor(_executor, functools.partial(fn, *args, **kwargs))
    return wrapper



@run_in_thread_executor
def blocking_work(n: int) -> int:
    # blocking / CPU / C-extension work
    return sum(i*i for i in range(n))

f = blocking_work(10_000_000)
result = f.result()   # blocks here until done


@run_in_thread_awaitable
def blocking_io(path: str) -> str:
    with open(path, "r") as fh:
        return fh.read()

async def main() -> None:
    text = await blocking_io("/some/huge/file")
    print(len(text))
