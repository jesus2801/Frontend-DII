import { z } from "zod";

// Validación de archivo (Foto < 2MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Esquema principal de Persona
export const PersonaSchema = z.object({
  tipoDocumento: z.enum(["CC", "TI"], {
    errorMap: () => ({ message: "Seleccione un tipo válido (CC o TI)" }),
  }),
  nroDocumento: z
    .string()
    .min(5, "Mínimo 5 dígitos")
    .max(10, "Máximo 10 dígitos")
    .regex(/^\d+$/, "El documento solo debe contener números"),
  primerNombre: z
    .string()
    .max(30, "Máximo 30 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/, "No se permiten números ni caracteres especiales"),
  segundoNombre: z
    .string()
    .max(30, "Máximo 30 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]*$/, "No se permiten números")
    .optional(),
  apellidos: z
    .string()
    .max(60, "Máximo 60 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/, "No se permiten números"),
  fechaNacimiento: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', {
    message: "Fecha inválida",
  }),
  genero: z.enum(["Masculino", "Femenino", "No binario", "Prefiero no reportar"]),
  email: z.string().email("Formato de correo inválido"),
  celular: z
    .string()
    .length(10, "El celular debe tener exactamente 10 dígitos")
    .regex(/^\d+$/, "Solo números"),
  foto: z
    .any()
    // En el frontend validamos si es FileList (del input)
    .refine((files) => files?.length == 1, "La foto es obligatoria.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `El tamaño máximo es 2MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Formato no soportado (.jpg, .jpeg, .png, .webp)"
    ),
});

export type PersonaFormData = z.infer<typeof PersonaSchema>;

// Tipo para respuesta del Backend (puede incluir ID o timestamps)
export interface Persona extends Omit<PersonaFormData, 'foto'> {
  id: string; // O el nroDocumento si es la PK
  fotoUrl?: string;
}