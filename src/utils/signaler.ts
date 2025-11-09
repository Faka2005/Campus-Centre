export type MessageSignal={
    senderId:string,
    sujet:string,
    content:string,

}

/**
 * 🔹 Envoie un signalement à l’administration
 * @param senderId
 * @param sujet
 * @param content
 * @returns boolean
 */
export  async function SendSignal(senderId:string,sujet:string,content:string):Promise<boolean>{
    try{
        const response = await fetch("http://localhost:5000/messages/signal/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ senderId, sujet, content }),
        });
        console.log("Request body:", { senderId, sujet, content });
        console.log("Response status:", response.status);
        if (response.ok) return true;
        console.error("Erreur lors de l’envoi du signal");
        return false;
    }catch(error){
        console.error("Erreur réseau lors de l’envoi du signal", error);
        return false;
    }
}

/**
 * 🔹 Récupère les signalements faits par un utilisateur
 * @param senderId
 * @returns MessageSignal[]
 * 
 */
export async function GetSignalsByUser(senderId:string):Promise<MessageSignal[]>{
    try{
        const response = await fetch(`http://localhost:5000/messages/signals/${senderId}`); 
        if(response.ok){
            const data = await response.json();
            return data.signals as MessageSignal[];
        }
        console.error("Erreur lors de la modification du message");
        return [];
    }catch(error){
        console.error("Erreur réseau lors de la modification du message", error);
        return [];
    }
}