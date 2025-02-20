# 2.sem.1st.projekt

En rate limiting mekaniske der bruges til at øge sikkerhed ved login forsøg.

### Første iteration:

Jeg har forsøgt mig at lave en rate limiting mekanisme via. POST anmodninger. Jeg er dog løbet ind i en udfordring for at den forsøge at udføre kode med GET frem for POST.

### Anden iteration:

Skifter POST anmodning ud med GET I håbe om at få mere respons frem for fejl. Det har nu lykkes mig at teste min mekanisme med forventet output når jeg tester igennem URL. Er dog løbet ind i et problem med cURL commands, da det ikke ser ud som de aktivere noget i min terminal. Dertil har jeg grund til at tror det kunne have noget med MAC IOS at gøre.

Men det skal sige at som den er lige nu skulle den gerne opfylde opgave krævende. Hvis dine første 3 login forsøg er forkerte vil den blocke IP adressen.
