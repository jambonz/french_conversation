const service = ({logger, makeService}) => {
  const svc = makeService({path: '/hello-world'});

  svc.on('session:new', (session) => {
    session.locals = {logger: logger.child({call_sid: session.call_sid})};
    logger.info({session}, `new incoming call: ${session.call_sid}`);

    try {
      session
        .on('close', onClose.bind(null, session))
        .on('error', onError.bind(null, session));

      session
        .pause({length: 1.5})
        .say({text: 'Bonjour. Comment puis-je vous aider aujourd’hui ?'})
        .pause({length: 8})
        .say({text: 'D’accord, merci de nous en informer. Je vais voir comment résoudre cela pour vous. Puis-je avoir votre nom et votre numéro de compte, s’il vous plaît ?'})
        .pause({length: 8})
        .say({text: 'Merci, Mme Dubois. Est-ce que vous pourriez également me confirmer votre adresse ?'})
        .pause({length: 8})
        .say({text: 'Merci beaucoup. Je vais vérifier s’il y a une panne dans votre secteur. Pourriez-vous patienter un moment, s’il vous plaît ?'})
        .pause({length: 8})
        .say({text: 'Merci pour votre patience. Après vérification, nous avons bien une panne dans votre région. Nos techniciens travaillent déjà à la résoudre, et nous espérons un rétablissement d’ici la fin de la journée'})
        .pause({length: 8})
        .say({text: 'Oui, absolument. Vous recevrez un SMS dès que la connexion sera rétablie, et vous pouvez également consulter l’état de la panne sur notre site internet'})
        .pause({length: 8})
        .say({text: 'Je vous en prie, Mme Dubois. Je suis désolé pour la gêne occasionnée et vous remercie de votre patience. Bonne journée !'})
        .pause({length: 8})
        .say({text: 'Au revoir !'})
        .pause({length: 10})
        .hangup()
        .send();
    } catch (err) {
      session.locals.logger.info({err}, `Error to responding to incoming call: ${session.call_sid}`);
      session.close();
    }
  });
};

const onClose = (session, code, reason) => {
  const {logger} = session.locals;
  logger.info({session, code, reason}, `session ${session.call_sid} closed`);
};

const onError = (session, err) => {
  const {logger} = session.locals;
  logger.info({err}, `session ${session.call_sid} received error`);
};

module.exports = service;
