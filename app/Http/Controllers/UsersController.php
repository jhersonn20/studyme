<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Mail\emailVerification;
use App\User;
use Carbon\Carbon;

class UsersController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {



        $user = User::orderBy('name', 'asc')
                  ->paginate(10)
                  ->toJson();

        //$user = User::all()->toJson();

        //$user = User::all()->paginate()->toJson();



        return $user;

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //

        $request->validate([
          'client' => 'required|string|max:255',
          'dept' => 'nullable|string|max:255',
          'name' => 'required|string|max:255',
          'email' => 'required|string|email|max:255|unique:users',
          'expiry' => 'required|',
          'password' => 'required|string|min:8',

        ]);

        //$hash_pass = Hash::make(request('password'));
        //dd(Carbon::parse(request('expiry'))->toDateString());


        $user = User::create(['client' => request('client'),
         'dept'  => request('dept'),
         'name'  => request('name'),
         'email' => request('email'),
         'password' => Hash::make(request('password')),
         'expiry' => Carbon::parse(request('expiry')),

       ]);

        // \Mail::to($user)->send(new emailVerification($user));

        return response()->json([
          'message' => 'Users Succesfully Added!',
        ],201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {

      $user = User::find(request('id'));

      $this->validate($request, [
        'dept' => 'nullable|string|max:255',
        'name' => 'required|string|max:255',
        'email' => 'required|unique:users,email,'.$user->id.'|email',
      ]);

      $user->update([
        'dept'  => request('dept'),
        'name'  => request('name'),
        'email' => request('email'),
        'expiry' => Carbon::parse(request('expiry')),
      ]);

      return response()->json([
        'message' => 'Users Succesfully Updated!',
      ],201);

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
