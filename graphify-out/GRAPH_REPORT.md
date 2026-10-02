# Graph Report - Cartefidelité  (2026-10-03)

## Corpus Check
- 716 files · ~4,806,145 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: (none) 6, .example 4, .css 4)

## Summary
- 3993 nodes · 12469 edges · 195 communities (164 shown, 31 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 48 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c1b00f92`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- caisse-scan.ts
- @prisma/client
- rbac.ts
- merchant-card-template-service.ts
- click/route.ts
- react
- loyalty-program.ts
- firstActiveStaffMembership
- google-wallet/route.ts
- loyalty-widget-view.tsx
- loyalty-widget.ts
- validation.ts
- VisualPicker
- card-editor-properties.tsx
- jsonOk
- google-wallet.ts
- merchant-billing.ts
- session.ts
- [id]/merchant-detail.tsx
- requireMerchantAdmin
- clients/ui.tsx
- jsonError
- money.ts
- isGoogleWalletConfigured
- google-auth.ts
- middleware.ts
- merchant/campaigns/route.ts
- clientIp
- fiche.tsx
- demo-routing.test.ts
- customer-reward-progress.ts
- create-super-admin.ts
- programme/ui.tsx
- CardEditorPage
- package.json
- google-wallet-media-crop.tsx
- statistiques-panel.tsx
- ad-visuals.ts
- customer-onboarding.ts
- What You Must Do When Invoked
- scan/ui.tsx
- media-storage.ts
- loyalty-commit.test.ts
- card-editor.tsx
- loyalty-commit.ts
- demo-session.ts
- src/app/page.tsx
- compilerOptions
- wallet-home.tsx
- loyalty-program-publication.ts
- super-admin.test.ts
- qa-login.ts
- ref_node_path
- dependencies
- loyaltyBalanceForMode
- email.ts
- devDependencies
- insight-stats.ts
- sponsored-slot.test.tsx
- google-wallet-global-preview.ts
- new-card-toast.tsx
- employee-session.ts
- scripts
- facturation/ui.tsx
- platform-stats.ts
- employee-demo-server.ts
- types.ts
- ref_fs
- webhook/route.ts
- stripe-webhook-route.test.ts
- fake-ad-db.ts
- demo-visual.ts
- merchant-card-renderer.tsx
- AdvantagesEditor
- reward-form-dialog.tsx
- rejoindre/[slug]/page.tsx
- unsubscribe/route.ts
- marketing-topup-route.test.ts
- campaign-quota.ts
- stripe.ts
- next
- cartes.js
- Fideto
- docker-entrypoint.sh
- profile-shared.tsx
- merchant-ui.tsx
- ad-visual-journeys.test.ts
- Notes pour le prochain agent - Carousel de cartes
- Cartes de fidélité — pack pour Cursor
- demo.js
- prisma.ts
- progress-ring.tsx
- semi-gauge.tsx
- campagnes/ui.tsx
- deploy.sh
- eslint.config.mjs
- next-env.d.ts
- postcss.config.mjs
- sw.js
- graphify reference: extra exports and benchmark
- customer-loyalty-overview.ts
- MerchantCampaignFiche
- src/app/layout.tsx
- layout-client.tsx
- generate-pwa-icons.mjs
- graphify reference: query, path, explain
- campaign-worker.test.ts
- insight-charts.tsx
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- notifications-center.tsx
- CLAUDE.md
- .claude/CLAUDE.md
- extraction-spec.md
- campaign-crud-routes.test.ts
- insight-definitions.ts
- env.ts
- ad-confirm-route.test.ts
- wallet-unlock.ts
- campaign-confirm-route.test.ts
- sponsored-placements.test.ts
- tarifs/page.tsx
- customer-layout-guard.ts
- sponsored-hours-pricing.ts
- marketing-balance.test.ts
- lib/campaign-worker.ts
- support-contact.ts
- app/ui.tsx
- employees/[id]/route.ts
- super-admin-campaign-moderation.test.ts
- MerchantDetailPage
- merchant-ad-edit.test.ts
- landing-page.test.ts
- customer-preferences-route.test.ts
- customer-qr.ts
- push-client.ts
- campaign-moderation-home.tsx
- campaign-fixes.test.ts
- admin-ad-fiche.test.ts
- EmployeeDetailPanel
- google-wallet-media-route.test.ts
- google-wallet-global-preview.test.ts
- campaign-test-mode-isolation.test.ts
- loyalty-service.test.ts
- google-wallet-doctor.ts
- merchant-roulette.tsx
- employee-invitation-service.ts
- profile-page.tsx
- vitest
- super-admin-ad-moderation.test.ts
- sponsored-slot.tsx
- finalisation/page.tsx
- ads/[id]/confirm/route.ts
- loyalty-cards-capture.mjs
- push.ts
- customer-push-route.test.ts
- ad-detail.tsx
- ProfilePage
- SettingsPage
- CreateMerchantWizard
- qa-login/page.tsx
- card-deck-interaction.test.ts
- sponsored-selection.ts
- ad-lifecycle-worker.ts
- landing-footer.tsx
- customer-qr-route.test.ts
- app/statistiques/page.tsx
- employee-access.test.ts
- card-template-schema.ts
- campaign-quota.test.ts
- loyalty-reward-removal.ts
- customer-notifications-route.test.ts
- statistiques-scroll.test.ts
- trim-card-images.mjs
- use-media-query.ts
- FinalisationForm
- avatar-storage.ts
- super-admin-ad-detail-page.test.ts
- ref_fs_promises
- ref_motion_react
- ref_next_font_google
- ref_next_headers
- ref_next_link
- ref_next_navigation
- ref_next_server
- ref_node_fs_promises
- ref_react_dom_client
- ref_react_dom_server
- ref_vitest_config
- SubscriptionsPage

## God Nodes (most connected - your core abstractions)
1. `jsonError()` - 261 edges
2. `jsonOk()` - 227 edges
3. `requireMutatingRequest()` - 163 edges
4. `next` - 161 edges
5. `prisma` - 148 edges
6. `vitest` - 123 edges
7. `clientIp()` - 119 edges
8. `readJson()` - 114 edges
9. `react` - 111 edges
10. `userAgent()` - 108 edges

## Surprising Connections (you probably didn't know these)
- `loop()` --calls--> `runAdLifecycleTick()`  [EXTRACTED]
  scripts/campaign-worker.ts → src/lib/ad-lifecycle-worker.ts
- `main()` --calls--> `getActiveMerchantLoyaltyContext()`  [EXTRACTED]
  scripts/diagnose-loyalty-program.ts → src/lib/loyalty-context.ts
- `main()` --calls--> `googleWalletLogoUrl()`  [EXTRACTED]
  scripts/google-wallet-doctor.ts → src/lib/google-wallet.ts
- `approvedAd()` --calls--> `PATCH()`  [EXTRACTED]
  tests/campaign-fixes.test.ts → src/app/api/merchant/ads/[id]/route.ts
- `submit()` --indirect_call--> `schedule()`  [INFERRED]
  src/app/app/campagnes/ui.tsx → tests/ad-visual-journeys.test.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (195 total, 31 thin omitted)

### Community 0 - "caisse-scan.ts"
Cohesion: 0.06
Nodes (46): main(), prisma, requiredEnv(), upsertEmployee(), publicScanPayload(), buildScanResult(), CaisseScanError, maskClientNumberForLog() (+38 more)

### Community 1 - "@prisma/client"
Cohesion: 0.14
Nodes (24): @prisma/client, GET(), dynamic, MerchantProfilePage(), formatAddress(), MerchantProfile(), join(), MerchantProfileData (+16 more)

### Community 2 - "rbac.ts"
Cohesion: 0.12
Nodes (24): CaissePage(), DashboardLayout(), DEMO_MERCHANT, hasMerchantStaffAccess(), isMerchantAppPublicPath(), MERCHANT_APP_PUBLIC_PATHS, resolveMerchantAppAccess(), shouldRedirectAppToEmployeeSpace() (+16 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.06
Nodes (57): ALL_SLOTS, cardCounts(), CardsIndexPage(), hasPublishedActiveSlot(), MerchantCardRow, modeLabel(), pickCurrentTemplate(), statusLabel() (+49 more)

### Community 4 - "click/route.ts"
Cohesion: 0.32
Nodes (5): GET(), isWithinUtcIntervals(), UtcInterval, adEventCreate, adRequestFindUnique

### Community 5 - "react"
Cohesion: 0.06
Nodes (37): react, Merchant, MerchantPublic(), metadata, ContactForm(), SPACES, EmployeeLoginScreen(), onSubmit() (+29 more)

### Community 6 - "loyalty-program.ts"
Cohesion: 0.13
Nodes (26): block(), buildNextBenefit(), centsToEarnAtLeast(), EarnEvaluation, evaluateEarn(), formatDurationMinutes(), isPurchaseAmountRequired(), minutesBetween() (+18 more)

### Community 7 - "firstActiveStaffMembership"
Cohesion: 0.20
Nodes (18): CampagneFichePage(), CampagnesPage(), SoldeMarketingPage(), CustomerDetailPage(), ClientsPage(), FidelisationPage(), FacturationPage(), OutilsPage() (+10 more)

### Community 8 - "google-wallet/route.ts"
Cohesion: 0.14
Nodes (25): ensureWalletClassRecord(), parseWalletAction(), POST(), publishedMediaExists(), schema, validateAppearanceColor(), contrastWithWhite(), GOOGLE_WALLET_RECOMMENDED_COLORS (+17 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.08
Nodes (35): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetProgress, LoyaltyWidgetProgressInput, LoyaltyWidgetView(), pct() (+27 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.07
Nodes (50): buildElementCatalog(), LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), dedupeIssues(), EditorValidationIssue, EditorValidationSummary, missingWidgetLabel(), publishValidationResult() (+42 more)

### Community 11 - "validation.ts"
Cohesion: 0.05
Nodes (45): POST(), POST(), GET(), sortOrder(), GET(), loadProgram(), POST(), requireCaisse() (+37 more)

### Community 12 - "VisualPicker"
Cohesion: 0.19
Nodes (13): deleteCampaignMediaUrl(), loadImageElement(), readFileAsDataUrl(), SelfVisualCropper(), uploadCampaignMedia(), VisualPicker(), dropSelfFiles(), onCropConfirm() (+5 more)

### Community 13 - "card-editor-properties.tsx"
Cohesion: 0.07
Nodes (56): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, GuideLine, handlesForElement() (+48 more)

### Community 14 - "jsonOk"
Cohesion: 0.07
Nodes (71): zod, POST(), POST(), GET(), markReadSchema, PATCH(), DELETE(), POST() (+63 more)

### Community 15 - "google-wallet.ts"
Cohesion: 0.20
Nodes (24): appLinkData(), availableRewardModules(), buildGoogleWalletMerchantView(), cardUrl(), classTemplateInfo(), globalClassPatchBody(), globalObjectBody(), GoogleWalletImage (+16 more)

### Community 16 - "merchant-billing.ts"
Cohesion: 0.10
Nodes (29): GET(), attachReceipts(), BillingError, CANCELLABLE, CancellationPreview, effectiveEndDate(), InvoicesResult, listMerchantInvoices() (+21 more)

### Community 17 - "session.ts"
Cohesion: 0.11
Nodes (29): POST(), GET(), POST(), POST(), schema, POST(), GET(), POST() (+21 more)

### Community 18 - "[id]/merchant-detail.tsx"
Cohesion: 0.12
Nodes (18): MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey, WalletMediaPreview, WalletPreviewView, formatActivity(), MerchantRow (+10 more)

### Community 19 - "requireMerchantAdmin"
Cohesion: 0.07
Nodes (54): DELETE(), EDITABLE_STATUSES, GET(), PATCH(), GET(), GET(), POST(), GET() (+46 more)

### Community 20 - "clients/ui.tsx"
Cohesion: 0.16
Nodes (14): Customer, CustomerDetail, CustomerDetailPanel(), CustomerInsight, CustomersPanel(), CustomerStats, CustomerTx, DEMO (+6 more)

### Community 21 - "jsonError"
Cohesion: 0.08
Nodes (34): GET(), PATCH(), GET(), POST(), POST(), dynamic, logCustomerQr(), POST() (+26 more)

### Community 22 - "money.ts"
Cohesion: 0.13
Nodes (21): appliedTierLabel(), earnPreviewLines(), progressLabelFor(), unitLabel(), evaluateReward(), parseRewardConditions(), RewardConditions, rewardIsStackable() (+13 more)

### Community 23 - "isGoogleWalletConfigured"
Cohesion: 0.13
Nodes (32): isGoogleWalletConfigured(), accessToken(), assertConfigured(), buildGoogleWalletIds(), classProfileForMode(), createGlobalGoogleWalletSaveUrl(), createMerchantGoogleWalletSaveUrl(), customerQrValue() (+24 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.14
Nodes (25): GET(), GET(), isGoogleAuthConfigured(), consumeGoogleCallback(), createGoogleAuthUrl(), decodeStateCookie(), encodeStateCookie(), GOOGLE_SCOPES (+17 more)

### Community 25 - "middleware.ts"
Cohesion: 0.15
Nodes (23): hostMatches(), hostnameOf(), isAdminHost(), isAppHost(), isCustomerHost(), isEmployeeHost(), isLocalHost(), legacyRedirectOrigin() (+15 more)

### Community 26 - "merchant/campaigns/route.ts"
Cohesion: 0.24
Nodes (10): DELETE(), GET(), loadOwnedCampaign(), PATCH(), POST(), serializeCampaign(), CAMPAIGN_STATUS_LABELS, refundCampaignDebit() (+2 more)

### Community 27 - "clientIp"
Cohesion: 0.09
Nodes (62): POST(), POST(), schema, POST(), logScanBody(), POST(), scanVia(), POST() (+54 more)

### Community 28 - "fiche.tsx"
Cohesion: 0.12
Nodes (19): AdStatus, Detail, euros(), HistoryRow, PaymentPreview, PayMethod, STATUS_LABELS, block (+11 more)

### Community 29 - "demo-routing.test.ts"
Cohesion: 0.17
Nodes (10): CLIENT_DEMO_COOKIE, isClientDemoMode(), isDemoCookie(), isPublicDemoEnabled(), MERCHANT_DEMO_COOKIE, DemoRole, isMerchantDemoCookieValue(), merchantDemoActiveFromRequest() (+2 more)

### Community 30 - "customer-reward-progress.ts"
Cohesion: 0.15
Nodes (19): PREVIEW_HISTORY, buildTargetView(), getCustomerMerchantRewardProgress(), resolveVisualState(), CustomerMerchantRewardProgress, MerchantRewardProgressTarget, REWARD_ALMOST_THRESHOLD_PERCENT, RewardProgressVisualState (+11 more)

### Community 31 - "create-super-admin.ts"
Cohesion: 0.50
Nodes (4): bcryptjs, main(), prisma, required()

### Community 32 - "programme/ui.tsx"
Cohesion: 0.16
Nodes (14): DEMO_CONFIG, MODES, modeTitle(), PROGRAM_STEPS, ProgramConfigurator(), goToStep(), isCurrentReward(), primaryFooterAction() (+6 more)

### Community 33 - "CardEditorPage"
Cohesion: 0.10
Nodes (36): CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction(), saveDraft() (+28 more)

### Community 34 - "package.json"
Cohesion: 0.08
Nodes (24): description, engines, node, name, prisma, seed, private, version (+16 more)

### Community 35 - "google-wallet-media-crop.tsx"
Cohesion: 0.24
Nodes (12): GoogleWalletMediaCrop(), confirm(), onPointerMove(), patchState(), centeredCropState(), clampCropState(), computeCoverCrop(), CropState (+4 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.11
Nodes (21): ApiResponse, COMPARISON_METRICS, FideliteTab(), FinancesTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder (+13 more)

### Community 37 - "ad-visuals.ts"
Cohesion: 0.11
Nodes (29): GET(), GET(), AD_SOURCE_MAX_IMAGES, AD_VISUAL_EXPORT_PX, AD_VISUAL_MAX_BYTES, AD_VISUAL_MAX_PX, AD_VISUAL_MIN_PX, AD_VISUAL_RATIO (+21 more)

### Community 38 - "customer-onboarding.ts"
Cohesion: 0.17
Nodes (16): beginCustomerOnboarding(), CustomerAccessLevel, CustomerOnboardingUser, customerWalletGuardRedirect(), FINALIZATION_PATH_PREFIXES, FINALIZATION_REMINDER_MS, isCustomerProfileFinalized(), isFinalizationAllowedPath() (+8 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "scan/ui.tsx"
Cohesion: 0.05
Nodes (67): ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeProfile, EmployeeScanScreen(), Phase, ScanResult, statusLabel() (+59 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.10
Nodes (32): GET(), MIME, GET(), MIME, GET(), notFound(), appearanceKeyForGoogleWalletMedia(), assertExactDimensions() (+24 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "card-editor.tsx"
Cohesion: 0.14
Nodes (8): PreviewScenario, PROGRESS_STEPS, SCENARIO_LABELS, CardEditorBackgroundCrop(), Action, HistoryState, useEditorHistory(), CARD_SLOT_TITLES

### Community 44 - "loyalty-commit.ts"
Cohesion: 0.09
Nodes (46): buildProgramSnapshot(), buildProgramSnapshotFromContext(), CaisseProgramSnapshot, applyAdjustment(), applyEarnVisit(), applyRedeemReward(), incrementBalanceData(), assembleView() (+38 more)

### Community 45 - "demo-session.ts"
Cohesion: 0.16
Nodes (20): GET(), GET(), GET(), GET(), GET(), demoCookieNamesForRole(), demoEnterTarget(), applyDemoRoleCookies() (+12 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.06
Nodes (40): next-themes, BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, HomePage(), MERCHANT_BENEFITS, metadata, PROOF_ITEMS (+32 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "wallet-home.tsx"
Cohesion: 0.10
Nodes (37): AddToGoogleWalletButton(), DiscoverIconLink(), NotificationBellLink(), WalletEventPayload, useWalletEvents(), connect(), disconnect(), onVisibility() (+29 more)

### Community 49 - "loyalty-program-publication.ts"
Cohesion: 0.16
Nodes (21): activeEligibleRewards(), assertRewardLimit(), countConfiguredRewards(), createAcquiredRewardEntitlements(), LoyaltyDraftReward, LoyaltyProgramDraft, MAX_CONFIGURED_REWARDS, ModeChangeDecision (+13 more)

### Community 50 - "super-admin.test.ts"
Cohesion: 0.15
Nodes (17): BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr(), sumCollectedRevenue() (+9 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.11
Nodes (28): ref_crypto, assertNoUnknownArgs(), main(), parseTtlMinutes(), assertQaLoginTtlMinutes(), configuredSubjectId(), createQaMagicLoginToken(), CreateQaMagicLoginTokenOptions (+20 more)

### Community 52 - "ref_node_path"
Cohesion: 0.06
Nodes (21): ref_node_fs, ref_node_path, playwright, outDir, pages, OUT, OUT, shots (+13 more)

### Community 53 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+11 more)

### Community 54 - "loyaltyBalanceForMode"
Cohesion: 0.18
Nodes (19): main(), dynamic, GET(), CarteIndexPage(), dynamic, CardPage(), dynamic, getCustomerLoyaltyOverview() (+11 more)

### Community 55 - "email.ts"
Cohesion: 0.28
Nodes (18): buildCampaignEmailContent(), buildCustomerFinalizationContent(), buildInvitationContent(), CampaignEmailInput, CustomerFinalizationEmailInput, emailConfigHint(), EmployeeInvitationEmailInput, escapeHtml() (+10 more)

### Community 56 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+8 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.06
Nodes (69): GET(), GET(), PERIOD_KEYS, requireMerchantStatsAccess(), addParisDays(), addParisMonths(), bucketKey(), enumerateBucketKeys() (+61 more)

### Community 58 - "sponsored-slot.test.tsx"
Cohesion: 0.12
Nodes (9): MobilePlacementPreview(), AD, calls, FakeIntersectionObserver, flush(), mount(), Observer, observers (+1 more)

### Community 59 - "google-wallet-global-preview.ts"
Cohesion: 0.27
Nodes (12): buildGlobalWalletValueAddedModule(), globalWalletCampaignDetailUri(), GlobalWalletCampaignModule, localized(), publicCampaignImageUrl(), walletHttpsUri(), adRequestToGlobalWalletCampaignModule(), GOOGLE_WALLET_QA_PREVIEW_MS (+4 more)

### Community 60 - "new-card-toast.tsx"
Cohesion: 0.13
Nodes (17): motion, react-dom, CardsSheet(), ExpandableQrCode(), handleActivate(), openQr(), ExpandableQrCodeProps, NewCardToast() (+9 more)

### Community 61 - "employee-session.ts"
Cohesion: 0.15
Nodes (16): EmployeeLoginPage(), ProEntryPage(), SPACES, employeeCookieName(), employeeFromToken(), employeeFromTokenWithReason(), EmployeeSession, employeeTokenFromRequest() (+8 more)

### Community 62 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, icons (+6 more)

### Community 63 - "facturation/ui.tsx"
Cohesion: 0.19
Nodes (14): api(), BillingPanel(), confirmCancellation(), openPortal(), startCancellation(), Cancellation, day(), Invoice (+6 more)

### Community 64 - "platform-stats.ts"
Cohesion: 0.29
Nodes (12): GET(), dateKey(), fillDailySeries(), getPlatformAlerts(), getPlatformOverview(), getPlatformRecentActivity(), getPlatformTimeSeries(), getSponsoredAdsStats() (+4 more)

### Community 65 - "employee-demo-server.ts"
Cohesion: 0.25
Nodes (9): CaisseAliasPage(), EmployeeHomePage(), EmployeeScanPage(), EMPLOYEE_DEMO_COOKIE, DEMO_EMPLOYEE, src_lib_employee_demo_employee_demo_cookie, isEmployeeDemoCookie(), isEmployeeDevDemo() (+1 more)

### Community 66 - "types.ts"
Cohesion: 0.05
Nodes (65): activeCardFromDeck(), CardDeck(), handleCardExpand(), handleDragEnd(), handleKeyDown(), snapTo(), DeckItem, demoStartIndex() (+57 more)

### Community 67 - "ref_fs"
Cohesion: 0.10
Nodes (15): ref_fs, ref_path, main(), outDir, shot(), outDir, main(), outDir (+7 more)

### Community 68 - "webhook/route.ts"
Cohesion: 0.09
Nodes (27): handleChargeRefunded(), handleCheckoutSessionCompleted(), handleCheckoutSessionExpired(), handlePaymentIntentFailed(), handleStripeEvent(), paymentIntentIdOf(), isCancellable(), isDuplicable() (+19 more)

### Community 69 - "stripe-webhook-route.test.ts"
Cohesion: 0.11
Nodes (15): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindFirst, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent (+7 more)

### Community 70 - "fake-ad-db.ts"
Cohesion: 0.13
Nodes (18): END, fake, h, previewCall(), START, END, fake, START (+10 more)

### Community 71 - "demo-visual.ts"
Cohesion: 0.13
Nodes (23): CarteIdentitePage(), AccountPage(), ParametresPage(), PREVIEW_BENEFITS, PREVIEW_PREFERENCES, PREVIEW_PROFILE, PREVIEW_PROFILE_HISTORY, CustomerLoyaltyOverview (+15 more)

### Community 72 - "merchant-card-renderer.tsx"
Cohesion: 0.12
Nodes (34): COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode, MerchantCardRenderer(), MerchantCardRendererProps, resolveDisplayQrSrc() (+26 more)

### Community 73 - "AdvantagesEditor"
Cohesion: 0.26
Nodes (16): AdvantagesEditor(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+8 more)

### Community 74 - "reward-form-dialog.tsx"
Cohesion: 0.22
Nodes (11): emptyReward(), FieldErrors, previewLine(), REWARD_TYPES, RewardFormDialog(), handleSubmit(), rewardTypeLabel(), RewardTypeOption (+3 more)

### Community 75 - "rejoindre/[slug]/page.tsx"
Cohesion: 0.18
Nodes (8): CustomerLoginPage(), CustomerLoginForm(), googleMessage(), recoverMessage(), CustomerSignupPage(), CustomerSignupForm(), JoinMerchantPage(), isGoogleSignInEnabled()

### Community 76 - "unsubscribe/route.ts"
Cohesion: 0.16
Nodes (15): jose, bodySchema, POST(), CONSENT_FIELDS, CONSENT_POLICY_VERSION, ConsentField, recordConsentEvents(), secretKey() (+7 more)

### Community 77 - "marketing-topup-route.test.ts"
Cohesion: 0.20
Nodes (8): createMarketingTopupCheckoutSession, FakeStripeNotConfiguredError, ledgerCreate, ledgerUpdate, requireMerchantAdmin, requireMutatingRequest, stripeMode, writeAudit

### Community 78 - "campaign-quota.ts"
Cohesion: 0.21
Nodes (12): CAMPAIGN_PRICE_CENTS, consumeQuotaForCampaign(), priceMemberOrNetworkCampaign(), priceSponsoredAd(), PricingResult, quotaKindFor(), INCLUDED_QUOTAS, isNetworkQuotaKind() (+4 more)

### Community 79 - "stripe.ts"
Cohesion: 0.09
Nodes (31): stripe, POST(), BillingCustomerInput, billingParams(), CampaignCheckoutInput, checkoutExpiry(), clientForMode(), clients (+23 more)

### Community 80 - "next"
Cohesion: 0.04
Nodes (47): nextConfig, next, recharts, metadata, viewport, SuperAdminSubscriptionsPage(), AuditPage(), SuperAdminAuditPage() (+39 more)

### Community 81 - "cartes.js"
Cohesion: 0.53
Nodes (5): getViewModel(), mount(), update(), nonNegativeNumber(), safeImageUrl()

### Community 82 - "Fideto"
Cohesion: 0.13
Nodes (14): Checklist de déploiement, Configuration Google Wallet, Création des sous-domaines DNS, Déploiement d’une mise à jour, Déploiement initial, Déploiement VPS sans Docker local, Fideto, Installation locale (sans Docker) (+6 more)

### Community 83 - "docker-entrypoint.sh"
Cohesion: 0.70
Nodes (4): fail(), is_placeholder_secret(), docker-entrypoint.sh script, validate_production_secrets()

### Community 84 - "profile-shared.tsx"
Cohesion: 0.25
Nodes (12): APP_VERSION, APPEARANCE_OPTIONS, AppearanceRow(), demoQuery(), EditField, fieldLabels, PasswordStrength(), ProfileShell() (+4 more)

### Community 85 - "merchant-ui.tsx"
Cohesion: 0.09
Nodes (28): EmployeeDetailPage(), EmployeesPage(), DEMO, Employee, EmployeesPanel(), formatActivity(), statusBadgeLabel(), statusTone() (+20 more)

### Community 86 - "ad-visual-journeys.test.ts"
Cohesion: 0.14
Nodes (15): submit(), adminPropose(), createAd(), ctx(), dataUrl(), fake, h, jsonRequest() (+7 more)

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "prisma.ts"
Cohesion: 0.10
Nodes (30): schema, GET(), DELETE(), FILTER_MAP, GET(), dynamic, GET(), dynamic (+22 more)

### Community 93 - "campagnes/ui.tsx"
Cohesion: 0.05
Nodes (40): historyDateKey(), HistoryFilter, matchesFilter(), SoldeMarketingPanel(), topup(), AD_STATUS_LABELS, AdRequest, AdStatus (+32 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "customer-loyalty-overview.ts"
Cohesion: 0.09
Nodes (31): CustomerProgramView, DETAIL_TABS, DetailTabId, EMPTY_RECENT_ACTIVITY, MerchantCardDetail(), fallbackCopyLink(), shareCard(), MerchantRewardProgressPanel() (+23 more)

### Community 102 - "MerchantCampaignFiche"
Cohesion: 0.35
Nodes (10): api(), MerchantCampaignFiche(), addSources(), onFile(), onFramed(), post(), onFileChosen(), isExactBanner() (+2 more)

### Community 103 - "src/app/layout.tsx"
Cohesion: 0.15
Nodes (8): src_app_globals, dynamic, manrope, metadata, viewport, PwaRegister(), THEME_COLOR, ThemeProvider()

### Community 104 - "layout-client.tsx"
Cohesion: 0.21
Nodes (8): DashboardLayout(), AppNav(), icons, isActive(), TOOLS_PREFIXES, BellItem, formatWhen(), NotificationBell()

### Community 105 - "generate-pwa-icons.mjs"
Cohesion: 0.16
Nodes (12): ref_node_buffer, ref_node_url, ref_node_zlib, outDir, outFile, root, chunk(), color (+4 more)

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 107 - "campaign-worker.test.ts"
Cohesion: 0.12
Nodes (15): baseCampaign, campaignDeliveryCount, campaignDeliveryCreateMany, campaignDeliveryFindMany, campaignDeliveryUpdate, campaignUpdate, customerMembershipFindMany, customerPreferencesFindMany (+7 more)

### Community 108 - "insight-charts.tsx"
Cohesion: 0.23
Nodes (11): InsightBarChart(), InsightCard(), InsightDonutChart(), InsightHeatmap(), InsightLineChart(), InsightMultiLineChart(), KpiCard(), PALETTE (+3 more)

### Community 109 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 110 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 111 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 114 - "notifications-center.tsx"
Cohesion: 0.19
Nodes (10): dynamic, NotificationsPage(), DEMO_NOTIFICATIONS, kindLabel(), NotificationItem, NotificationKind, NotificationMerchant, NotificationsCenter() (+2 more)

### Community 118 - "campaign-crud-routes.test.ts"
Cohesion: 0.20
Nodes (8): campaignCreate, campaignFindFirst, campaignFindMany, campaignUpdate, refundCampaignDebit, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 120 - "env.ts"
Cohesion: 0.13
Nodes (10): dynamic, robots(), dynamic, sitemap(), assertSameOrigin(), CsrfError, env, getAllowedOrigins() (+2 more)

### Community 121 - "ad-confirm-route.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindFirst, adRequestUpdate, adRequestUpdateMany, campaignUpdate, createCampaignCheckoutSession, executeRaw, FakeStripeNotConfiguredError, getQuotaUsage (+5 more)

### Community 122 - "wallet-unlock.ts"
Cohesion: 0.18
Nodes (15): dynamic, GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), runtime, sseChunk(), resetQrCache() (+7 more)

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.12
Nodes (17): baseCampaign, campaignFindFirst, campaignUpdate, campaignUpdateMany, debitForCampaign, estimateMerchantMembersAudience, estimateNetworkLocalAudience, getMarketingBalanceCents (+9 more)

### Community 124 - "sponsored-placements.test.ts"
Cohesion: 0.15
Nodes (17): GET(), GET(), previewResponse(), isSafeAdUrl(), staffContext(), loadAdPreviewCard(), parsePlacement(), selectSponsoredForCustomer() (+9 more)

### Community 125 - "tarifs/page.tsx"
Cohesion: 0.18
Nodes (12): AppLoginPage(), FIDETO_MONTHLY, metadata, PACK_SETUP, TarifsPage(), PricingFaq(), QUESTIONS, formatEurosFromCents() (+4 more)

### Community 126 - "customer-layout-guard.ts"
Cohesion: 0.42
Nodes (5): CarteLayout(), CompteLayout(), NotificationsLayout(), enforceCustomerWalletAccess(), runCustomerOnboardingSideEffects()

### Community 127 - "sponsored-hours-pricing.ts"
Cohesion: 0.12
Nodes (25): addDaysToDateInput(), defaultSlotFor(), firstSelectableDate(), HourlySchedulePicker(), addDay(), hoursToSlots(), scheduleDayError(), slotAmountCents() (+17 more)

### Community 128 - "marketing-balance.test.ts"
Cohesion: 0.27
Nodes (8): isValidTopupAmountCents(), Entry, makeTx(), Mode, snapshot(), state, transaction(), uniqueViolation()

### Community 129 - "lib/campaign-worker.ts"
Cohesion: 0.22
Nodes (15): log(), loop(), requestShutdown(), sleep(), backoffMinutesForAttempt(), claimNextScheduledCampaign(), deliveryChannelsFor(), finalizeCampaignIfComplete() (+7 more)

### Community 130 - "support-contact.ts"
Cohesion: 0.27
Nodes (8): nodemailer, ContactPage(), EmailSendResult, isValidEmailAddress(), escapeHtml(), getConfiguredSupportEmail(), sendPublicContactEmail(), supportEmailConfigHint()

### Community 131 - "app/ui.tsx"
Cohesion: 0.18
Nodes (6): HomeStats, KPI_ICONS, MerchantHome(), QUICK_ACTIONS, StatsPreview, TrendMetric

### Community 132 - "employees/[id]/route.ts"
Cohesion: 0.17
Nodes (19): GET(), GET(), mapEmployee(), PATCH(), employeeLoginUrl(), GET(), mapEmployee(), POST() (+11 more)

### Community 133 - "super-admin-campaign-moderation.test.ts"
Cohesion: 0.18
Nodes (9): campaignFindUnique, campaignPaymentUpdate, campaignUpdate, refundCampaignDebit, refundCampaignPayment, refundIncludedQuota, requireMutatingRequest, requireSuperAdmin (+1 more)

### Community 134 - "MerchantDetailPage"
Cohesion: 0.21
Nodes (6): MerchantDetailPage(), clearWalletLocalPreviews(), reloadMerchant(), saveWalletDraft(), walletAction(), revokeWalletPreviews()

### Community 135 - "merchant-ad-edit.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindFirst, adRequestUpdate, campaignUpdate, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 136 - "landing-page.test.ts"
Cohesion: 0.18
Nodes (9): authTargets, connexionUi, faq, footer, header, heroVisual, page, proPage (+1 more)

### Community 137 - "customer-preferences-route.test.ts"
Cohesion: 0.22
Nodes (7): basePrefs, consentEventCreateMany, customerPreferencesCreate, customerPreferencesFindUnique, customerPreferencesUpdate, requireMutatingRequest, requireUser

### Community 138 - "customer-qr.ts"
Cohesion: 0.46
Nodes (7): qrcode, ensureCustomerMembershipForSlug(), ensureCustomerQrToken(), generateCustomerQrDataUrl(), isUniqueViolation(), logCustomerQr(), tryEnsureCustomerMembershipForSlug()

### Community 139 - "push-client.ts"
Cohesion: 0.39
Nodes (5): enablePushNotifications(), getPushSupportState(), isIosNotStandalone(), PushSupportState, urlBase64ToUint8Array()

### Community 140 - "campaign-moderation-home.tsx"
Cohesion: 0.20
Nodes (8): AD_STATUS_FILTER_OPTIONS, AD_STATUS_LABELS, AdRequest, AdStatus, CampaignModerationHome(), formatCents(), NetworkCampaign, RejectTarget

### Community 141 - "campaign-fixes.test.ts"
Cohesion: 0.21
Nodes (16): ad(), approvedAd(), asAdmin(), asCustomer(), asMerchant(), ctx(), customerCard(), dataUrl() (+8 more)

### Community 142 - "admin-ad-fiche.test.ts"
Cohesion: 0.21
Nodes (9): adminStage(), createAd(), ctx(), fake, h, jsonReq(), merchantStage(), moderate() (+1 more)

### Community 143 - "EmployeeDetailPanel"
Cohesion: 0.29
Nodes (6): EmployeeDetailPanel(), patchEmployee(), reactivate(), resendInvite(), saveProfile(), suspend()

### Community 145 - "google-wallet-global-preview.test.ts"
Cohesion: 0.20
Nodes (9): adFindUnique, adRow, previewDeleteMany, previewFindMany, previewFindUnique, previewUpdate, previewUpsert, syncGlobal (+1 more)

### Community 146 - "campaign-test-mode-isolation.test.ts"
Cohesion: 0.13
Nodes (14): adEventCreate, adRequestFindMany, adRequestFindUnique, campaignDeliveryCreateMany, campaignUpdate, customerMembershipFindMany, customerPreferencesFindMany, inAppNotificationCreate (+6 more)

### Community 147 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 148 - "google-wallet-doctor.ts"
Cohesion: 0.52
Nodes (6): google-auth-library, accessToken(), fail(), main(), ok(), pngSize()

### Community 149 - "merchant-roulette.tsx"
Cohesion: 0.38
Nodes (3): LinearGauge(), MerchantFace(), MerchantRoulette()

### Community 150 - "employee-invitation-service.ts"
Cohesion: 0.20
Nodes (17): buildInvitationLink(), canEmployeeAccess(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR, invitationExpiryDate(), isInvitationExpired(), acceptInvitationWithPassword() (+9 more)

### Community 151 - "profile-page.tsx"
Cohesion: 0.16
Nodes (15): AvatarFileInput(), AvatarPreviewEditor(), cropCircleToDataUrl(), loadImage(), useAvatarEditor(), GlassBottomSheet(), SheetAction(), HistoryFilter (+7 more)

### Community 152 - "vitest"
Cohesion: 0.11
Nodes (12): vitest, baseProgram, customerMembershipFindMany, customerPreferencesFindMany, root, root, LOGO_PATH, PNG_SIGNATURE (+4 more)

### Community 153 - "super-admin-ad-moderation.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindUnique, adRequestUpdate, campaignUpdate, requireMutatingRequest, requireSuperAdmin, writeAudit

### Community 154 - "sponsored-slot.tsx"
Cohesion: 0.15
Nodes (13): DiscoverPage(), Merchant, IMAGE_CLASS, SponsoredAd, SponsoredBanner(), SponsoredVariant, getDismissedAds(), rememberDismissed() (+5 more)

### Community 155 - "finalisation/page.tsx"
Cohesion: 0.54
Nodes (6): FinalisationPage(), resolveCustomerAccessLevel(), isSmsConfigured(), sendSms(), smsConfigHint(), SmsSendResult

### Community 156 - "ads/[id]/confirm/route.ts"
Cohesion: 0.13
Nodes (38): main(), billingCustomer(), computeAdPricing(), GET(), InsufficientBalance, pendingCheckout(), POST(), QuotaExhausted (+30 more)

### Community 157 - "loyalty-cards-capture.mjs"
Cohesion: 0.40
Nodes (3): goto(), OUT, tiers

### Community 158 - "push.ts"
Cohesion: 0.29
Nodes (8): web-push, isWebPushConfigured(), ensureConfigured(), PushPayload, PushSendResult, sendPushToSubscription(), sendPushToUser(), WebPushNotConfiguredError

### Community 159 - "customer-push-route.test.ts"
Cohesion: 0.33
Nodes (4): pushSubscriptionDeleteMany, pushSubscriptionUpsert, requireMutatingRequest, requireUser

### Community 160 - "ad-detail.tsx"
Cohesion: 0.09
Nodes (31): AdDetailPage(), confirmReason(), patch(), requestSend(), run(), sendProposal(), startWalletPreview(), stopWalletPreview() (+23 more)

### Community 161 - "ProfilePage"
Cohesion: 0.38
Nodes (6): ProfilePage(), patchProfile(), saveNameEdit(), profileInitials(), toneClass(), displayFullName()

### Community 162 - "SettingsPage"
Cohesion: 0.33
Nodes (3): SettingsPage(), patchProfile(), saveFieldEdit()

### Community 163 - "CreateMerchantWizard"
Cohesion: 0.50
Nodes (3): CreateMerchantWizard(), goNext(), stepError()

### Community 164 - "qa-login/page.tsx"
Cohesion: 0.36
Nodes (5): dynamic, QaLoginPage(), QaLoginClient(), readFragmentToken(), isQaMagicLoginEnabled()

### Community 165 - "card-deck-interaction.test.ts"
Cohesion: 0.53
Nodes (3): CARD_NO_EXPAND_SELECTOR, shouldIgnoreCardExpand(), shouldProceedWithCardExpand()

### Community 166 - "sponsored-selection.ts"
Cohesion: 0.14
Nodes (22): AdCandidate, CustomerZone, DeliveryCheck, evaluateCampaignChecks(), GLOBAL_COOLDOWN_MS, IMPRESSION_DEDUPE_MS, inAudience(), isAdEligibleForCustomer() (+14 more)

### Community 168 - "ad-lifecycle-worker.ts"
Cohesion: 0.60
Nodes (4): computeAdLifecycleStatus(), runAdLifecycleTick(), expireDueGoogleWalletGlobalAdPreviews(), scheduleGoogleWalletGlobalCampaignResync()

### Community 169 - "landing-footer.tsx"
Cohesion: 0.67
Nodes (3): COLUMNS, isInternalPath(), LandingFooter()

### Community 170 - "customer-qr-route.test.ts"
Cohesion: 0.29
Nodes (5): generateCustomerQrDataUrl, isCustomerQrInfrastructureError, requireMutatingRequest, requireUser, tryEnsureCustomerMembershipForSlug

### Community 172 - "employee-access.test.ts"
Cohesion: 0.53
Nodes (4): assertEarnProgramRules(), employeeCookieName(), employeeTokenFromRequest(), hasEmployeeCookie()

### Community 173 - "card-template-schema.ts"
Cohesion: 0.11
Nodes (19): CardTemplateBackground(), buildCardBackgroundImageStyle(), CardBackgroundSettings, DEFAULT_BACKGROUND, CardDecorativeStyle, cardElementSchema, CardLogoStyle, CardProgressColors (+11 more)

### Community 174 - "campaign-quota.test.ts"
Cohesion: 0.47
Nodes (5): campaignQuotaUsageFindUnique, campaignQuotaUsageUpsert, executeRaw, fakeTx(), merchantSubscriptionFindUnique

### Community 175 - "loyalty-reward-removal.ts"
Cohesion: 0.47
Nodes (4): decideRewardRemoval(), LoyaltyRewardDraft, RewardRemovalDecision, updateDraftRewardsForRemoval()

### Community 176 - "customer-notifications-route.test.ts"
Cohesion: 0.33
Nodes (5): inAppNotificationCount, inAppNotificationFindMany, inAppNotificationUpdateMany, requireMutatingRequest, requireUser

### Community 177 - "statistiques-scroll.test.ts"
Cohesion: 0.33
Nodes (4): appNav, globalsCss, layoutClient, statistiquesPanel

### Community 178 - "trim-card-images.mjs"
Cohesion: 0.40
Nodes (3): ref_sharp, files, INPUT_DIR

### Community 181 - "avatar-storage.ts"
Cohesion: 0.50
Nodes (4): AVATAR_DIR, MIME_TO_EXT, parseAvatarDataUrl(), saveAvatar()

### Community 182 - "super-admin-ad-detail-page.test.ts"
Cohesion: 0.40
Nodes (4): adRequestFindUnique, getSuperAdminSessionUser, notFound, redirect

### Community 194 - "SubscriptionsPage"
Cohesion: 1.00
Nodes (3): SubscriptionsPage(), load(), toggleInsight()

## Knowledge Gaps
- **1010 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+1005 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1361 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `caisse-scan.ts`, `@prisma/client`, `rbac.ts`, `app/ui.tsx`, `click/route.ts`, `react`, `merchant-card-template-service.ts`, `firstActiveStaffMembership`, `merchant-ad-edit.test.ts`, `customer-preferences-route.test.ts`, `super-admin-campaign-moderation.test.ts`, `campaign-moderation-home.tsx`, `session.ts`, `[id]/merchant-detail.tsx`, `clients/ui.tsx`, `profile-page.tsx`, `google-auth.ts`, `middleware.ts`, `sponsored-slot.tsx`, `clientIp`, `finalisation/page.tsx`, `demo-routing.test.ts`, `super-admin-ad-moderation.test.ts`, `customer-push-route.test.ts`, `ad-detail.tsx`, `package.json`, `qa-login/page.tsx`, `ad-visuals.ts`, `ad-visual-ui-contracts.test.ts`, `scan/ui.tsx`, `media-storage.ts`, `landing-footer.tsx`, `app/statistiques/page.tsx`, `card-editor.tsx`, `demo-session.ts`, `src/app/page.tsx`, `customer-qr-route.test.ts`, `wallet-home.tsx`, `customer-notifications-route.test.ts`, `loyaltyBalanceForMode`, `insight-stats.ts`, `employee-session.ts`, `employee-demo-server.ts`, `types.ts`, `ref_fs`, `demo-visual.ts`, `rejoindre/[slug]/page.tsx`, `unsubscribe/route.ts`, `marketing-topup-route.test.ts`, `profile-shared.tsx`, `merchant-ui.tsx`, `prisma.ts`, `campagnes/ui.tsx`, `customer-loyalty-overview.ts`, `src/app/layout.tsx`, `layout-client.tsx`, `notifications-center.tsx`, `campaign-crud-routes.test.ts`, `env.ts`, `ad-confirm-route.test.ts`, `campaign-confirm-route.test.ts`, `sponsored-placements.test.ts`, `tarifs/page.tsx`, `customer-layout-guard.ts`?**
  _High betweenness centrality (0.184) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `caisse-scan.ts`, `rbac.ts`, `merchant-card-template-service.ts`, `click/route.ts`, `react`, `loyalty-program.ts`, `google-wallet/route.ts`, `loyalty-widget-view.tsx`, `loyalty-widget.ts`, `card-editor-properties.tsx`, `merchant-billing.ts`, `money.ts`, `google-auth.ts`, `middleware.ts`, `demo-routing.test.ts`, `customer-reward-progress.ts`, `CardEditorPage`, `package.json`, `google-wallet-media-crop.tsx`, `statistiques-panel.tsx`, `customer-onboarding.ts`, `scan/ui.tsx`, `media-storage.ts`, `loyalty-commit.test.ts`, `loyalty-commit.ts`, `loyalty-program-publication.ts`, `super-admin.test.ts`, `qa-login.ts`, `ref_node_path`, `loyaltyBalanceForMode`, `email.ts`, `insight-stats.ts`, `sponsored-slot.test.tsx`, `google-wallet-global-preview.ts`, `new-card-toast.tsx`, `employee-session.ts`, `platform-stats.ts`, `types.ts`, `ref_fs`, `webhook/route.ts`, `stripe-webhook-route.test.ts`, `fake-ad-db.ts`, `merchant-card-renderer.tsx`, `unsubscribe/route.ts`, `marketing-topup-route.test.ts`, `campaign-quota.ts`, `stripe.ts`, `ad-visual-journeys.test.ts`, `customer-loyalty-overview.ts`, `src/app/layout.tsx`, `campaign-worker.test.ts`, `campaign-crud-routes.test.ts`, `env.ts`, `ad-confirm-route.test.ts`, `wallet-unlock.ts`, `campaign-confirm-route.test.ts`, `sponsored-placements.test.ts`, `tarifs/page.tsx`, `marketing-balance.test.ts`, `support-contact.ts`, `employees/[id]/route.ts`, `super-admin-campaign-moderation.test.ts`, `merchant-ad-edit.test.ts`, `landing-page.test.ts`, `customer-preferences-route.test.ts`, `push-client.ts`, `campaign-fixes.test.ts`, `admin-ad-fiche.test.ts`, `google-wallet-media-route.test.ts`, `google-wallet-global-preview.test.ts`, `campaign-test-mode-isolation.test.ts`, `loyalty-service.test.ts`, `employee-invitation-service.ts`, `super-admin-ad-moderation.test.ts`, `customer-push-route.test.ts`, `card-deck-interaction.test.ts`, `ad-visual-ui-contracts.test.ts`, `ad-lifecycle-worker.ts`, `customer-qr-route.test.ts`, `employee-access.test.ts`, `campaign-quota.test.ts`, `loyalty-reward-removal.ts`, `customer-notifications-route.test.ts`, `statistiques-scroll.test.ts`, `super-admin-ad-detail-page.test.ts`?**
  _High betweenness centrality (0.149) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `@prisma/client` to `caisse-scan.ts`, `lib/campaign-worker.ts`, `rbac.ts`, `merchant-card-template-service.ts`, `employees/[id]/route.ts`, `loyalty-program.ts`, `loyalty-widget.ts`, `validation.ts`, `customer-qr.ts`, `card-editor-properties.tsx`, `jsonOk`, `google-wallet.ts`, `merchant-billing.ts`, `session.ts`, `requireMerchantAdmin`, `loyalty-service.test.ts`, `employee-invitation-service.ts`, `profile-page.tsx`, `google-auth.ts`, `money.ts`, `vitest`, `clientIp`, `ads/[id]/confirm/route.ts`, `customer-reward-progress.ts`, `create-super-admin.ts`, `programme/ui.tsx`, `CardEditorPage`, `package.json`, `customer-onboarding.ts`, `sponsored-selection.ts`, `scan/ui.tsx`, `ad-lifecycle-worker.ts`, `card-editor.tsx`, `loyalty-commit.ts`, `card-template-schema.ts`, `loyalty-reward-removal.ts`, `wallet-home.tsx`, `loyalty-program-publication.ts`, `super-admin.test.ts`, `qa-login.ts`, `loyaltyBalanceForMode`, `insight-stats.ts`, `google-wallet-global-preview.ts`, `employee-session.ts`, `platform-stats.ts`, `types.ts`, `webhook/route.ts`, `merchant-card-renderer.tsx`, `unsubscribe/route.ts`, `campaign-quota.ts`, `next`, `merchant-ui.tsx`, `prisma.ts`, `customer-loyalty-overview.ts`, `env.ts`, `wallet-unlock.ts`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _1010 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `caisse-scan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05819209039548023 - nodes in this community are weakly interconnected._
- **Should `@prisma/client` be split into smaller, more focused modules?**
  _Cohesion score 0.13763440860215054 - nodes in this community are weakly interconnected._
- **Should `rbac.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11742424242424243 - nodes in this community are weakly interconnected._