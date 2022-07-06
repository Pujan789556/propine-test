*Assumption or Decisions*

- need to create a CLI command
- need to pass arguments in CLI commands
- to pass arguments -> `yargs` is used

- there will be two parameters:
1) token (-t/--token) Value must be either of BTC/ETH/XRP
2) date (-d/--date) will be in format yyyy/mm/dd later converted to epoch (end of the day)


- Need to read csv file and import it to database (postgres).
- Read csv in batch of 1000 row and bult insert 1000 rows to database.

- Use `axios` to call api for exchange rates

- When no parameters is provided:
    - Query Database for the SUM of amount calculated according to transaction_type. IF transaction_type is DEPOSIT, add, else subtract. and group by token

- When token is provided:
    - Query Database for the SUM of amount calculated according to transaction_type. IF transaction_type is DEPOSIT, add, else subtract. and matching the token provided and group by token

- When date is provided:
    - Query Database for the SUM of amount calculated according to transaction_type. IF transaction_type is DEPOSIT, add, else subtract. where timestamp is for provided date and group by token

- When date and token is provided:
    - Query Database for the SUM of amount calculated according to transaction_type. IF transaction_type is DEPOSIT, add, else subtract. where timestamp is for provided date and token matches the provided token and group by token

Calculate the total portolio by multiplying the rate by total of each token.



# STEP TO RUN 
- Copy `.env.template` to `.env` and update accordingly
- Copy `transaction.csv` file to `bin` folder

*to install node packages*

    $ npm install 

*to install scripts*

    $ npm install -g .

## First Parse CSV and Import to database
    $ parsecsv
 
 It might take time to parse and import to database

## To Get Portfolio

*without parameters*

    $ portfolio 

*with token parameter*

    $ portfolio -t <token>  

    EG: portfolio -t 'BTC'

*with date parameter*

    $ portfolio -d <date(yyyy/mm/dd)> 

    EG: portfolio -d '2019/10/11'

*with both date and token parameters*

    $ portfolio -d <date(yyyy/mm/dd)> -t <token> 

    EG: portfolio -d '2019/10/11' -t 'BTC'

### Available Parameters

    -t --token  (BTC/ETH/XRP)

    -d --date   (yyyy/mm/dd)

