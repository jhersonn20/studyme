@component('mail::message')
Dear {{$user->name}},

Al Salama Lakum!

Welcome to ARCC Portal. We've succesfully created your account in our <a href="https://portal.arccksa.com"> portal </a>.

Kindly link the button below to verify your email address

or click this link address to verify your email.

@component('mail::panel')
@component('mail::button', ['url' => ''])
Verify Email
@endcomponent

@endcomponent

Thanks you,<br>
ARCC Portal Administrator
@endcomponent
