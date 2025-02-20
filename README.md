# 2.sem.1st.projekt

En rate limiting mekaniske der bruges til at øge sikkerhed ved login forsøg.

### Første iteration:

Jeg har forsøgt mig at lave en rate limiting mekanisme via. POST anmodninger. Jeg er dog løbet ind i en udfordring for at den forsøge at udføre kode med GET frem for POST.

### Anden iteration:

Skifter POST anmodning ud med GET I håbe om at få mere respons frem for fejl. Det har nu lykkes mig at teste min mekanisme med forventet output når jeg tester igennem URL. Er dog løbet ind i et problem med cURL commands, da det ikke ser ud som de aktivere noget i min terminal. Dertil har jeg grund til at tror det kunne have noget med MAC IOS at gøre.

Men det skal sige at som den er lige nu skulle den gerne opfylde opgave krævende. Hvis dine første 3 login forsøg er forkerte vil den blocke IP adressen.

### UPDATE

Koden virker som den skal og jeg kan godt bruge cURL på mac. Problemet var at terminalen blir låst så snart jeg starter serveren. Det betyder at jeg ikke kan skrive kommandoer og derfor skete der ikke noget.

Så for at jeg kan teste dette program skal jeg have 2 terminaler åben: 1. hvor jeg starter min server 2. hvor jeg skriver min cURL kommando

CORS er også blevet fjernet i koden da jeg arbejder i terminaler som opgaven er lige nu. Hvis man i fremtiden skulle arbejde med klientsiden vil der være relavant at have med.

#### Test IP adresser:

**IP-adresse med forkert adgangskode:** curl -X GET "http://localhost:3000/login?username=wrong&password=wrong" -H "X-Forwarded-For: 192.168.1.100"

**Anden IP-adresseMed forkert adgangskode:** curl -X GET "http://localhost:3000/login?username=wrong&password=wrong" -H "X-Forwarded-For: 203.0.113.42"

**IP-adresse med rigtig adgangskode:** curl -X GET "http://localhost:3000/login?username=user&password=password" -H "X-Forwarded-For: 202.1.223.92"
