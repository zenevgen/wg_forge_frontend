// this is an example of improting data from JSON
import orders from '../data/orders.json';
import users from '../data/users.json';
console.log(JSON.stringify(orders));
console.log(JSON.stringify(users));

    orders.forEach(addOrderRow);
        function addOrderRow(item) {
            let newTr = document.createElement("tr");
            newTr.setAttribute("id", "order_"+item['id']);

            let newTransactionId = document.createElement("td");
            newTransactionId.appendChild(document.createTextNode(item['transaction_id']));

            let newUserInfo = document.createElement("td");
            newUserInfo.setAttribute("class", "user_data");
            let userAnchor = document.createElement("a");
            userAnchor.setAttribute('href','#');
            userAnchor.innerText = createUserName(item.user_id);
            newUserInfo.appendChild(userAnchor);

            let newOrderDate = document.createElement("td");
            let orderDate = new Date(item['created_at']*1000);
            newOrderDate.appendChild(document.createTextNode(orderDate.toLocaleString().replace(/\./g, '/').replace(',', '')));

            let newOrderAmount = document.createElement("td");
            let orderAmount = new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'USD' }).format(item['total']);
            newOrderAmount.appendChild(document.createTextNode(orderAmount));

            let newCardNumber = document.createElement("td");
            let cardNumber = item['card_number'].split('').fill('*', 2, -4).join('');
            newCardNumber.appendChild(document.createTextNode(cardNumber));

            let newCardType = document.createElement("td");
            newCardType.appendChild(document.createTextNode(item['card_type']));

            let newLocation = document.createElement("td");
            let locationTextString = item['order_country']+ ' (' +item['order_ip'] + ')';
            newLocation.appendChild(document.createTextNode(locationTextString));

            newTr.appendChild(newTransactionId);
            newTr.appendChild(newUserInfo);
            newTr.appendChild(newOrderDate);
            newTr.appendChild(newOrderAmount);
            newTr.appendChild(newCardNumber);
            newTr.appendChild(newCardType);
            newTr.appendChild(newLocation);

            let currentTableBody = document.getElementById("tbody");
            currentTableBody.appendChild(newTr);


        }


            function createUserName(id) {
                let user = users.filter((item) => {
                    return item.id === id;
                });
                switch(user[0].gender) {
                    case 'Male':
                        return 'Mr. ' + user[0].first_name + ' ' + user[0].last_name;
                    default:
                        return 'Ms. ' + user[0].first_name + ' ' + user[0].last_name;
                }
            }