# Note per Progetti

Sono una _lista di attività_ in sequeza o parallele che possono essere attribuite
a più persone. Ci sono fasi e sottofasi

Come gestisco le fasi e sottofasi?
Posso gestire le fasi come attributo sulla attività e ordino in base a quello.
Di base non ci sono fasi (oppure non categorizzato)

```yaml
Progetto:
    - Fase 1:
        - Attività 1:
        - Attività 2:
        ...

    - Fase 2: ....
```

Le attività hanno una data di partenza e una di fine. La data di partenza può
essere indipendente oppure dipendere da un'altra attività.
Indipendente: Parte l'attività appena arriva quella data (?)
Dipendente: Serve che l'attività precedente sia stata completata per partire.

Se si arriva alla data di inzio in una dipendente e non è stata ancora completata
l'attività precedente allora ci sono due modalità:
Traslazione: Si sposta tutto avanti di un tot di tempo
Contrazione: Si riduce tutto per far rispettare le date di fine

Traslazione e Contrazione sono attributi sulla data di fine.

I milestones non possono traslare. Sono la fine di un'attività importante

I progetti e le attività possono essere appuntante con delle note.

Ogni attività ha un valore di status:

- Non attivabile: Dipende da un'attività non completata
- Attivabile: L'attività ha le condizioni per partire ma la persona associata non l'ha ancora fatta partire
- Attiva: La persona ha dichiarato di aver fatto partire l'attività
- Conclusa: La persona ha dichiarato di aver concluso l'attività
- Riattivata: Il capo-progetto ha detto che non è conclusa e vuole revisioni (?)
- In ritardo: Data di conlusione passata ma non ancora conclusa
- Abbandonata: La persona ha dichiarato di non occuparsene più, oppure la data di fine è passata da molto tempo (?)

Le attività si vedono sul calendario.
I progetti si possono vedere come lista o come modalità GANTT
Chiunque può creare progetti (diventa capo-progetto) e includere altri utenti

Solo il capo-progetto può modificare il progetto, aggiungere, togliere o
raggruppare attività e cambiare le sincronizzazioni tra le attività.
Solo il capo-progetto in caso di ritardi può decidere se traslare o contrarre le
attività sincronizzate a quella in ritardo.

Gli attori coinvolti ricevono una notifica sulla decisione del capo- progetto.
