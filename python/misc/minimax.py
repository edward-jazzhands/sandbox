from copy import deepcopy
from typing import Callable, TypeVar, ParamSpec, Awaitable
import functools
from itertools import product
import asyncio
import concurrent.futures

P = ParamSpec("P")
R = TypeVar("R")

_executor: concurrent.futures.ThreadPoolExecutor = concurrent.futures.ThreadPoolExecutor()

# This is an example of how to make a decorator function that will
# make a function run in a different thread using the ThreadPoolExecutor.
# This is really helpful in Python, but other languages will have their
# own idiosyncratic ways of creating workers or using background threads.
def run_in_thread_awaitable(fn: Callable[P, R]) -> Callable[P, Awaitable[R]]:
    """Async-friendly: returns an awaitable."""
    
    @functools.wraps(fn)
    async def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
        loop = asyncio.get_running_loop()
        # run in the same executor so threads are reused
        return await loop.run_in_executor(_executor, functools.partial(fn, *args, **kwargs))
    return wrapper


####################################

# In the game, this grid would actually used by the game engine.
int_board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
]
grid_size = len(int_board)
# same with the move counter, this is normally used by the 'game engine':
move_counter = 0

# The following counters are only for logging purposes. However they
# are modified by the minimax function, and due to that being in
# a different thread, that might be an issue, depending on how you're
# doing it / what language you're working in (In python it was fine,
# but likely won't be in most other languages).

# This simply counts how many times the minimax function has been called in total:
minimax_counter = 0
# This counts how many times the alpha-beta pruner pruned a branch:
pruning_counter = 0
# This counts how many times the minimax hit the recursive depth limit:
depth_limit_counter = 0

async def computer_turn_orch():

    board_copy = deepcopy(int_board)
    ai_row, ai_col = await computer_turn_worker(board_copy)
    # if ai_row is None:
    #     raise ValueError("AI made an invalid move.")

    print(
        f"Minimax counter: {minimax_counter}\n"
        f"Branches pruned: {pruning_counter}\n"
        f"Times depth limit reached: {depth_limit_counter}\n"
    )        

    int_board[ai_row][ai_col] = 2              # Apply AI move to integer board
    global move_counter
    move_counter += 1
    # post_message(AIMove(ai_row, ai_col))  # Updates the cell state in the Grid

    # The calculate_winner function is not shown here - it's not relevant
    # to how the minimax works, and its meant to be different for each game.
    # The only important part is that we pass in the board, and we
    # get a result back (player1, player2, no winner, or draw).
    game_result = calculate_winner(int_board)
    if game_result is not None:
        # post_message(GameOver(game_result))
        return
    
    # post_message(ChangeTurn(PlayerState.PLAYER1))     # Change turn back to human


# NOTE: In python, its pythonic to create this "computer turn worker"
# function, and attach a decorator to it, in order to isolate the minimax
# algorithm onto its own thread. However, in other languages, the canonical way
# of running CPU-intensive work in a background thread
# might look very different from this.
@run_in_thread_awaitable
def computer_turn_worker(board: list[list[int]]) -> tuple[int, int]:

    _, best_move = minimax(
        board,
        depth=0,
        alpha = float('-inf'),
        beta = float('inf'), 
        maximizingPlayer=True           # AI is maximizer
    )
    assert best_move is not None
    return best_move

def minimax(
    board: list[list[int]],
    depth: int,
    maximizingPlayer: bool,
    alpha: float,
    beta: float
) -> tuple[float, tuple[int, int] | None]:       # score, best_move coordinates
    """
    Args:
        board: The current game board state
        depth: Current depth in the game tree
        maximizingPlayer: True if AI's turn (maximizing), False if human's turn (minimizing)

    Returns:
        (best_score, best_move): A tuple containing the best score found
        and the 'best move' which is another tuple of coordinates."""

    # remember this is just for logging how many times it ran total:
    global minimax_counter
    minimax_counter += 1

    # Very first step: Run the calculate winner function on the integer board
    # AS THE BOARD IS going into the function BEFORE trying out any moves.
    # We want to see, is there *currently* a winning move on the board?
    # Of course, this will never find a winning move at our starting depth of 0.
    # Because that would mean the human player already won and the game is over.
    # Thus, we know on the first depth-level minimax run, this is guaranteed
    # to return -1 the first time, meaning 'no win found / game ongoing'.
    result = calculate_winner(board)
  
    # Note the calculate winner function is not shown in this example script.
    # It's not necessary to show it, in our case its just a basic tic tac toe
    # winner checker. But the point is that its modular - this winner calculator
    # can be changed to match whatever game this minimax algorithm is used in.

    # this is just to assist the type checking in this example:
    assert result in [-1, 0, 1, 2]

    # If the minimax has found a winning move
    if result == 2:                 # found winning move for player 2     
        return 10 - depth, None
    elif result == 1:               # found winning move for player 1
        return -10 + depth, None
    elif result == 0:               # This move results in a draw game
        return 0, None
    # EXPLANATION:
    # If the result is PLAYER 2, that means the AI would win with that move.
    # So we return a score of 10, minus the depth it took to find that win.
    # (ie, one depth level would mean 10-1 which is a score of 9)
    
    # If result is PLAYER 1, that means the AI would lose with that move.
    # So return a score of negative 10, plus the depth
    # (ie one depth level would mean -10+4 depth away would give -6)
    # This illustrates how the Human's winning move is less dangerous the more
    # moves away it would be, and the computer's winning move is more useful
    # the less moves away it would be.
    # Also note that the "game ending" cases above return `None` for coordinate.
    # We know they can't happen on depth 0, so we just want them to recurse back
    # to the previous stack level and return the score. Then the loop below
    # will record the move (row, col) which achieved that score.
    
    # This section here is to adjust the depth limit based on some criteria. You
    # can for example continuously raise/lower the depth limit as the game progresses
    # and more or less moves become available. You might also want to adjust it
    # for things like game properties, variable grid sizes, etc.
    if grid_size <= 3:
        max_depth = 9
    elif grid_size == 4:             
        max_depth = move_counter if move_counter < 5 else 5   # Starts at 1, increases to 5.
    elif grid_size == 5:
        max_depth = move_counter if move_counter < 3 else 3   # for 5x5 its capped at 3.
    else:
        max_depth = 10

    # The point of max depth is to cap how long the AI can search for.
    # In the start of a complex game, there might be millions
    # of possible move combinations that can be searched. That can take
    # a long time. max_depth will make the minimax return "no move found" if it
    # is reached.
    # Generally, you would combine this with something that afterwards
    # makes the AI fall back to something semi-random or based on a heuristic.
    
    # max_depth might be set above, or you might have it set elsewhere in your
    # game settings. Regardless of where you set it, here we want
    # to return if we hit it.
    if depth == max_depth:
        global depth_limit_counter
        depth_limit_counter += 1
        return 0, None  # found nothing so return score of 0 (same as if it found a draw)

    player: int = 2 if maximizingPlayer else 1
    # var to hold current best move tuple:
    best_move: tuple[int, int]  = (-1, -1)
    # var to hold current best score:
    best_score: float = float('-inf') if maximizingPlayer else float('inf')
    # EXPANATION:
    # If we're on player 2 (AI, maximizing), best score starts
    # at negative inf because that is the worst possible score for the maximizer.
    # Vice versa for Player 1 (human, minimizer).
    
    # Now try all possible moves.
    # EXPLANATION:
    # product() from itertools package is some pythonic syntax sugar
    # that replaces nested for loops. This is equivalent to doing:
    # for row in range(grid_size):
    #     for col in range(grid_size):
    
    for row, col in product(range(grid_size), range(grid_size)):
        if board[row][col] == 0:    # only empty cells (aka only valid moves)

            # place player on board at this spot:
            board[row][col] = player
            # Then run the minimaxer with the new board:
            score, _, = minimax(board, depth + 1, not maximizingPlayer, alpha, beta)
            # When finished, undo the move:
            board[row][col] = 0
            # EXPLANATION on move undo-ing:
            # After finishing every recursive call, the board will be put back
            # the way it was, recursively. This saves us from needing to
            # create many hundreds or thousands of copies of the integer board.
            # Its faster to undo moves than to deepcopy the entire board every
            # time the minimax is called recursively (which might be hundreds
            # of thousands of calls).

            # Remember, if maximizing (AI, player 2), best_score starts
            # at negative infinity
            if maximizingPlayer:
                if score > best_score:
                    best_score = float(score)
                    best_move = (row, col)
                    # Pruner: set alpha at this depth to new score
                    # if it's higher than previous alpha
                    alpha = max(score, alpha)
            # if minimizing (simulating human player), best_score starts
            # at positive infinity
            else:
                if score < best_score:
                    best_score = float(score)
                    best_move = (row, col)
                    # Pruner: set beta at this depth to new score
                    # if its lower than previous beta
                    beta = min(score, beta)
                    
            # Note the Pruner is not technically necessary for the minimaxer
            # to work but it greatly enhance the speed and efficiency.

            if beta <= alpha:
                # The pruning counter here is only for logging:
                global pruning_counter
                pruning_counter += 1
                
                # This break is the necessary part for the pruner to work.
                # We are telling it to stop searching for more moves at this
                # depth level and recurse out.
                break

    return best_score, best_move