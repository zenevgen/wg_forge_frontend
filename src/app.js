// this is an example of improting data from JSON
import orders from '../data/orders.json';
import users from '../data/users.json';
import companies from '../data/companies.json';
console.log(JSON.stringify(orders));
console.log(JSON.stringify(users));
console.log(JSON.stringify(companies));

    orders.forEach(addOrderRow);
        function addOrderRow(item) {
            let newTr = document.createElement("tr");
            newTr.setAttribute("id", "order_"+item['id']);

            let newTransactionId = document.createElement("td");
            newTransactionId.appendChild(document.createTextNode(item['transaction_id']));

            let newUserInfo = document.createElement("td");
            newUserInfo.setAttribute("class", "user_data");
            createUserName(item.user_id, newUserInfo);

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


            function createUserName(id, parent) {

                let userAnchor = document.createElement("a");
                userAnchor.setAttribute('href','#')

                let user = users.filter((item) => {
                    return item.id === id;
                });
                switch(user[0].gender) {
                    case 'Male':
                        userAnchor.innerText = 'Mr. ' + user[0].first_name + ' ' + user[0].last_name;
                    default:
                        userAnchor.innerText = 'Ms. ' + user[0].first_name + ' ' + user[0].last_name;
                }

                parent.appendChild(userAnchor);

                let extendedUserInfo = document.createElement('div');
                extendedUserInfo.setAttribute("class","user-details");
                extendedUserInfo.style.display = 'none';

                let birthday = document.createElement('p');
                birthday.innerText = `Birthday: ${new Date(user[0].birthday*1000).toLocaleString('en-US')}`;
                extendedUserInfo.appendChild(birthday);

                let photo = document.createElement('p');
                let image = document.createElement('img');
                image.src = user[0].avatar;
                image.width = '100';
                photo.appendChild(image);
                extendedUserInfo.appendChild(photo);

                function getCompanyObj(id) {
                    let company = companies.filter((item) => {
                        return item.id === id;
                    });
                    return company[0];
                }

                let company = getCompanyObj(user[0].company_id)?getCompanyObj(user[0].company_id):{};
                let companyName = document.createElement('p');
                companyName.innerHTML = `Company: <a href="${company.url}" target="_blank">${company.title}</a>`;

                extendedUserInfo.appendChild(companyName);

                let industry = document.createElement('p');
                industry.innerText = `Industry: ${company.industry} / ${company.sector}`;
                extendedUserInfo.appendChild(industry);

                parent.appendChild(extendedUserInfo);

                function clickHandler(event) {
                    event.preventDefault();
                    if (extendedUserInfo.style.display === 'none') {
                        extendedUserInfo.style.display = 'block';
                    } else {
                        extendedUserInfo.style.display = 'none';
                    }
                };
                userAnchor.addEventListener('click', clickHandler);

            }