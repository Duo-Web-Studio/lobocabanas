function sanitize(phone?: string | null): string {
  return (phone ?? "").replace(/\D/g, "");
}

export function waLink(phone: string | null | undefined, message: string): string {
  const digits = sanitize(phone);
  const text = encodeURIComponent(message.slice(0, 900));
  return digits ? `https://wa.me/${digits}?text=${text}` : `https://wa.me/?text=${text}`;
}

export function generalMessage(): string {
  return "Olá! Estou vendo as cabanas da Lobo Cabanas e gostaria de tirar uma dúvida.";
}

export function cabinMessage(cabinName: string): string {
  return `Olá! Estou vendo a Cabana ${cabinName} no site da Lobo Cabanas e gostaria de tirar uma dúvida.`;
}

export function cabinDatesMessage(
  cabinName: string,
  checkIn: string,
  checkOut: string,
  guests: number,
): string {
  const fmt = (iso: string) => iso.split("-").reverse().slice(0, 2).join("/");
  return `Olá! Estou interessado na Cabana ${cabinName} de ${fmt(checkIn)} a ${fmt(checkOut)} para ${guests} ${guests === 1 ? "hóspede" : "hóspedes"}. Gostaria de tirar uma dúvida.`;
}

export function bookingDoneMessage(code: string): string {
  return `Olá! Acabei de realizar a reserva ${code} pelo site e gostaria de falar com a equipe.`;
}

export function guestContactMessage(
  guestFirstName: string,
  code: string,
  cabinName: string,
): string {
  return `Olá ${guestFirstName}! Aqui é da Lobo Cabanas. Estamos entrando em contato sobre sua reserva ${code} para a Cabana ${cabinName}.`;
}