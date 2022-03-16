# How to simplify Hyperledger development with Oracle Blockchain App Builder 

## Logical Business Architecture

## Create Tax Authority (Founder Org) instance of Oracle Blockchain
In the OCI menu, locate Blockhain Platform (Developer Services -> Blockchain Platform) and click on it.      

![Menu](images/general-menu-1.png)

Press Create Blockchain Platform button. This will open a dialog to specify parameters fo the founder organization.

![Create Founder](images/founder-create-1.png)
Make sure you select "Create a new network", since we are creating founder instance. Founder instance has the priviledge to control late joiners into the network. Sine we are doing just a prototype, we will use Standard edition, bringing 2 OCPUs (two physical cores), 50GB of storage and 2 peer nodes. Remember, peer nodes are the nodes responsible for preservance of the data in blockchain. In ideal production world, you would like to have more peer nodes due to security and availabiltiy requirements.

![Create Founder](images/founder-create-2.png)

## Create Wor and Pension Department (Member Org) instance of Oracle Blockchain