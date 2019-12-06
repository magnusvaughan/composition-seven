@component('mail::message')

Thank you for registering!

Please verify your account by clicking the link below.

@component('mail::button', ['url' => $url])
Verify Email
@endcomponent


Regards,<br>
{{ config('app.name') }}

@endcomponent