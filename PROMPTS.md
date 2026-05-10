# Prompts para regenerar assets · solo VIDEO

Modelo imágenes: **gpt-image-2** (chatgpt.com). Modelo video: **Veo3 modo Frames**.
Carpeta destino: `landing-icebar/public/photos/raw/` (los muevo yo después).

> Nota: las imágenes estáticas de la landing (hero, og-image, exp-cards, etc.) las vemos después. Este archivo se enfoca en los **frames + clips para el video del hero**.

---

## Reglas

- **Logo en las capas térmicas (RECOMENDADO)**: las fotos reales del cliente muestran el logo "ICE BAR EXPERIENCE" con el osito polar pequeño y sutil en el pecho de la capa plateada. Eso da credibilidad inmediata (es el bar real, no stock). Subir el logo como reference image en los frames con personas (frames a y b). En frame-c (bartender + tumbler) NO se necesita.
- **Si no querés lidiar con el logo**: dejá las capas sin logo, sigue siendo coherente. Se puede agregar después en una iteración.
- **Si gpt-image-2 distorsiona el logo** (lo agranda, lo pone girado, etc.), follow-up: `Same image but make the logo on the cape smaller, more subtle, properly aligned on the upper-left chest with realistic fabric folds. Keep everything else exactly the same.`
- **Si una imagen sale muy IA**, follow-up: `Same image but with more visible skin texture, less saturated colors, more natural everyday lighting. More like a real candid phone photo.`

### Cómo subir el logo

1. Adjuntar el archivo `landing-icebar/public/brand/logo-vertical-color.svg` (osito polar + "ICE BAR EXPERIENCE") al chat de ChatGPT
2. Agregar este bloque al **final** del prompt:

```
Reference Image 1: ICE BAR EXPERIENCE brand logo (vertical layout: polar bear icon above the "ICE BAR EXPERIENCE" wordmark, blue color). Place this logo small and subtle on the upper-left chest area of the silver thermal cape, integrated naturally with realistic fabric folds and shadows matching the scene lighting. The logo should appear screen-printed on the cape fabric (not pasted, not enlarged, not centered, not stylized). Size: about 4cm wide on the chest in real-world scale. Same colors and proportions as the reference image.
```

### Workflow para continuidad entre frames (importante)

Para que `frame-a-end` tenga las MISMAS personas con el MISMO logo en la MISMA posición que `frame-a-start`, usar este flujo:

1. Generar `frame-a-start.jpg` (con logo subido si querés)
2. Para `frame-a-end.jpg`: subir el `frame-a-start.jpg` recién generado como reference image + el prompt indicado abajo
3. Mismo flujo para par B (b-start → b-end)

Esto evita drift entre frames (caras distintas, capas distintas, logo en posición distinta).

---

## Frames Veo3 (6) · sin logo en `frame-c`

### `frame-a-start.jpg` (1920x1080) · + logo recomendado
```
[Filename: frame-a-start.jpg | Resolution: 1920x1080]
Photorealistic candid photograph, 35mm film look, medium close-up at eye level. 3 friends in their late 20s/30s inside an indoor bar with cool-blue ambient LED lighting, wearing silver metallic puffy quilted thermal capes (typical ice bar attire) with hoods DOWN and faces fully visible, black insulated thermal gloves on hands holding thick ice-carved tumblers with bright green caipirinha at chest height. Real skin texture (visible pores, slight asymmetry, no beauty filter), natural unstyled hair (some strands out of place from the hood). One friend mid-laugh, another smiling wide, third with subtle smile — mouths only slightly open, no wide-open mouths. They are NOT looking at camera. Air is completely clear, transparent atmosphere with no particles, no fog, no mist, no breath vapor visible. Background completely out of focus (deep bokeh, indistinct cool-blue glow), no clear architectural details visible.
Honest and unposed. No glamorization, no retouching, no studio lighting, no oversaturated colors, no fog effects, no smoke, no watermark, no text. Generate at high quality. Save as frame-a-start.jpg.
```

### `frame-a-end.jpg` (1920x1080) · usá `frame-a-start.jpg` como reference
```
[Filename: frame-a-end.jpg | Resolution: 1920x1080]
Reference Image 1: previously generated frame-a-start.jpg.
Photorealistic candid photograph, 35mm film look, medium close-up at eye level. SAME 3 friends from Reference Image 1 in the SAME indoor bar, SAME silver metallic puffy thermal capes (with same logo placement on the chest if visible in reference), SAME black insulated gloves, SAME hairstyles, SAME face identities. Now mid-toast — ice-carved tumblers gently touching in front of them at chest height (NOT colliding, just softly meeting), gloved hands visible holding the glasses. Smiling with mostly closed lips or subtle open smile, looking at each other (NOT at camera). Air is completely clear, transparent atmosphere with no particles, no fog, no mist, no breath vapor, no impact splash on the glasses meeting point — only dry condensation droplets on the glass surface. Same warm-cyan ambient light, same deep bokeh blue-cool background.
Preserve identity, capes, logo placement, and lighting from Reference Image 1. Honest and unposed. No glamorization, no retouching, no fog, no smoke, no impact effects, no watermark, no text. Generate at high quality. Save as frame-a-end.jpg.
```

### `frame-b-start.jpg` (1920x1080) · + logo recomendado
```
[Filename: frame-b-start.jpg | Resolution: 1920x1080]
Photorealistic candid photograph, 35mm film look, medium close-up at eye level. 4 friends in their late 20s inside an indoor bar with cool-blue ambient LED lighting, wearing silver metallic puffy quilted thermal capes (typical ice bar attire) with hoods DOWN and faces fully visible, black insulated thermal gloves on hands holding thick ice-carved tumblers with bright green caipirinha at chest height. Real skin texture (visible pores, asymmetry), natural unstyled hair. Mid-conversation just before toasting, smiling and looking at each other in anticipation — mouths only slightly open, no wide-open mouths. NOT looking at camera. Air is completely clear, transparent atmosphere with no particles, no fog, no mist, no breath vapor visible. Background completely out of focus (deep bokeh, indistinct cool-blue glow), no clear architectural details visible.
Honest and unposed. No glamorization, no retouching, no studio lighting, no fog effects, no smoke, no watermark, no text. Generate at high quality. Save as frame-b-start.jpg.
```

### `frame-b-end.jpg` (1920x1080) · usá `frame-b-start.jpg` como reference
```
[Filename: frame-b-end.jpg | Resolution: 1920x1080]
Reference Image 1: previously generated frame-b-start.jpg.
Photorealistic candid photograph, 35mm film look, medium close-up at eye level. SAME 4 friends from Reference Image 1 in the SAME indoor bar, SAME silver metallic puffy thermal capes (with same logo placement on the chest if visible in reference), SAME black insulated gloves, SAME hairstyles, SAME face identities. Ice-carved tumblers now gently touching at the center of the frame in a clean toast (NOT colliding, just softly meeting). Smiling with mostly closed lips or subtle open smile, looking at each other. Air is completely clear, transparent atmosphere with no particles, no fog, no mist, no breath vapor, no impact splash on the glasses meeting point — only dry condensation droplets on the glass surface. Same warm-cyan ambient light, same deep bokeh blue-cool background.
Preserve identity, capes, logo placement, and lighting from Reference Image 1. Honest and unposed. No glamorization, no retouching, no fog, no smoke, no impact effects, no watermark, no text. Generate at high quality. Save as frame-b-end.jpg.
```

### `frame-c-start.jpg` (1920x1080) · sin logo
```
[Filename: frame-c-start.jpg | Resolution: 1920x1080]
Photorealistic candid macro photograph, 35mm film look, extreme close-up. Bartender's bare hands (visible from wrist down, dark insulated long-sleeve jacket, NO gloves so skin texture is visible — visible knuckles, natural imperfections, real pores) pouring fresh green caipirinha from a clear glass jug into a thick ice-carved tumbler resting on a thick translucent ICE bar counter (NOT wooden) with subtle cool-blue underlight from beneath. Mid-pour, liquid stream visible. Subtle frozen mist drifts above the counter. Background completely out of focus (deep bokeh, no bottles or architecture visible).
Honest and unposed. No glamorization, no retouching, no watermark, no logos, no text. Generate at high quality. Save as frame-c-start.jpg.
```

### `frame-c-end.jpg` (1920x1080) · sin logo · usá `frame-c-start.jpg` como reference
```
[Filename: frame-c-end.jpg | Resolution: 1920x1080]
Reference Image 1: previously generated frame-c-start.jpg.
Photorealistic candid macro photograph, 35mm film look, extreme close-up. SAME thick translucent ICE bar counter from Reference Image 1 with the same cool-blue underlight, SAME thick ice-carved tumbler now full of bright green caipirinha with a fresh lime wedge on the rim. Camera angle slightly rotated about 20 degrees clockwise. Natural condensation drops on the ice surface around the tumbler. Bartender's hands no longer visible. Subtle frozen mist drifts above the counter. Same deep bokeh background, no architecture visible.
Preserve the counter, lighting, and overall ambiance from Reference Image 1. Honest and unposed. No glamorization, no retouching, no watermark, no logos, no text. Generate at high quality. Save as frame-c-end.jpg.
```

---

## Videos Veo3 (3) · sin logo en `clip-c`

> En modo Frames, Veo3 toma el `first frame` y el `last frame` y interpola los 8s entre ellos. El prompt orienta el movimiento. Si los frames tienen logo, el clip lo va a heredar automáticamente.

> **Importante**: Veo3 tiende a 2 problemas conocidos: (a) amplifica cualquier "vapor/breath/mist/condensation" en humo blanco gigante, (b) inventa manos/vasos/objetos extra al interpolar entre frames (object hallucination). Los prompts de abajo combaten ambos con negativos agresivos + conteo explícito de objetos.

### `clip-a-laughs.mp4` (8s 1920x1080 24fps no audio) · Frames: `frame-a-start` → `frame-a-end`
```
8-second handheld documentary shot of EXACTLY 3 friends inside a warm indoor bar with cool-blue ambient LED lighting, wearing silver metallic puffy thermal capes (hoods down) and black insulated gloves, laughing softly and toasting with ice-carved caipirinha tumblers. Treat the bar as room temperature — NOT a freezer, NOT a cold environment, just a warm dimly lit lounge with blue ambient lights.

ATMOSPHERE (most important): air is completely clear, transparent, dry and still. Atmospheric particles are absent. The scene contains zero atmospheric effects of any kind. No fog, no mist, no smoke, no steam, no vapor, no clouds, no breath visible from mouths, no exhalation puffs, no fog clouds rising, no dry-ice effects, no atmospheric haze, no impact splash when glasses meet, no white burst, no frost explosion. The atmosphere stays identical from second 0 to second 8.

OBJECT COUNT: exactly 3 people, exactly 3 hands holding tumblers, exactly 3 ice tumblers visible. Object count remains constant throughout the 8 seconds. Nothing appears, nothing duplicates, no phantom hands, no extra glasses materialize.

EXPRESSIONS: friends smile with mostly closed lips or subtly open mouths only. No wide-open mouths, no laughing with mouth fully open. This prevents any breath effect.

MOVEMENT: hands move smoothly from chest height inward, glasses meet gently at the center with the lightest possible contact. No collision, no impact force.

CAMERA: natural slight handheld movement (NOT smooth gimbal, NOT static tripod). Cool-blue ambient lighting only, deep background bokeh.

Preserve all clothing details, faces, and any visible brand logo on the capes exactly as in the keyframes. No glamorization, no text, no watermark.
```

### `clip-b-toast.mp4` (8s 1920x1080 24fps no audio) · Frames: `frame-b-start` → `frame-b-end`
```
8-second slow-motion handheld shot of EXACTLY 4 friends inside a warm indoor bar with cool-blue ambient LED lighting, wearing silver metallic puffy thermal capes (hoods down) and black insulated gloves, raising thick ice-carved tumblers with green caipirinhas to toast. Treat the bar as room temperature — NOT a freezer, NOT a cold environment, just a warm dimly lit lounge with blue ambient lights.

ATMOSPHERE (most important): air is completely clear, transparent, dry and still. Atmospheric particles are absent. The scene contains zero atmospheric effects of any kind. No fog, no mist, no smoke, no steam, no vapor, no clouds, no breath visible from mouths, no exhalation puffs, no fog clouds rising, no dry-ice effects, no atmospheric haze, no impact splash when glasses meet, no white burst, no frost explosion. The atmosphere stays identical from second 0 to second 8.

OBJECT COUNT: exactly 4 people, exactly 4 hands holding tumblers, exactly 4 ice tumblers visible. Object count remains constant throughout the 8 seconds. Nothing appears, nothing duplicates, no phantom hands, no extra glasses materialize.

EXPRESSIONS: friends smile with mostly closed lips or subtly open mouths only. No wide-open mouths, no laughing with mouth fully open. This prevents any breath effect.

MOVEMENT: tumblers move smoothly from chest height inward, glasses meet gently at the center with the lightest possible contact. No collision, no impact force, no shake.

CAMERA: documentary slow-motion handheld, cool-blue ambient lighting only, deep bokeh background.

Preserve all clothing details, faces, and any visible brand logo on the capes exactly as in the keyframes. No glamorization, no text, no watermark.
```

### `clip-c-pour.mp4` (8s 1920x1080 24fps no audio) · Frames: `frame-c-start` → `frame-c-end`
```
8-second macro handheld shot. Bartender's bare hands finish pouring fresh green caipirinha into a thick ice-carved tumbler on a translucent ICE bar counter with cool-blue underlight, then withdraw out of frame. Camera slowly orbits about 20 degrees clockwise around the glass. Lime wedge appears on the rim.

OBJECT COUNT: only ONE tumbler and ONE glass jug in frame — no extras, no duplicates, no phantom objects materialize. Bartender has exactly TWO hands, no extra hands or fingers appear during the pour or withdrawal.

ATMOSPHERE: ambient air is clear. Only very subtle natural water condensation droplets form on the ice surface — strictly NO mist cloud, NO smoke burst, NO fog above the counter, NO dry-ice steam, NO white vapor effect. The cold feeling comes from cool-cyan lighting, not from artificial fog.

Natural cool-cyan ambient lighting from the ice itself, deep background bokeh. Documentary product cinematography. No text, no watermark, no logos.
```

---

## Orden recomendado de generación

Para máxima continuidad visual, generá en este orden:

1. `frame-a-start.jpg` (con logo si querés)
2. `frame-a-end.jpg` (subiendo `frame-a-start.jpg` como reference)
3. `frame-b-start.jpg` (con logo si querés — pueden ser otras 4 personas distintas)
4. `frame-b-end.jpg` (subiendo `frame-b-start.jpg` como reference)
5. `frame-c-start.jpg` (sin logo, sin reference)
6. `frame-c-end.jpg` (subiendo `frame-c-start.jpg` como reference)

Después los 3 clips de Veo3 con sus pares de frames.

---

## Checklist (6 frames + 3 videos = 9 archivos)

Frames Veo3:
- [ ] `frame-a-start.jpg` · [ ] `frame-a-end.jpg`
- [ ] `frame-b-start.jpg` · [ ] `frame-b-end.jpg`
- [ ] `frame-c-start.jpg` · [ ] `frame-c-end.jpg`

Clips Veo3:
- [ ] `clip-a-laughs.mp4` · [ ] `clip-b-toast.mp4` · [ ] `clip-c-pour.mp4`
